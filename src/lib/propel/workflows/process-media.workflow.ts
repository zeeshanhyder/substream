import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from '../../activities';
import { extractImdbEntriesFromBingSearch } from '../../../util/extract-imdb-entries';
import { getClosestMatchingImdbTitleId } from '../../../util/search-tmdb-imdb-title';
import { IMediaEntity, MediaEntityModel } from '../../../models/media-entity';
import { mongoMediaSearchPipeline } from '../../utils';

const {
  extractFileMetadata,
  queryBing,
  queryDB,
  fetchTmdbEntry,
  fetchTmdbEpisodes,
  insertMetadata,
  insertMediaEntry,
  deleteMediaEntry,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1 second',
    maximumAttempts: 3,
    backoffCoefficient: 2,
  },
});

type ProcessMediaInput = {
  mediaId: string;
  userId: string;
  filePath: string;
};

export default async function processMediaWorkflow({
  userId,
  mediaId,
  filePath,
}: ProcessMediaInput): Promise<IMediaEntity | {}> {
  try {
    const dbSearchResult = await queryDB({
      $or: [
        { userId, 'seasons.episodes.mediaLocation': filePath },
        { userId, mediaLocation: filePath },
      ],
      pipeline: mongoMediaSearchPipeline(filePath, userId),
    });
    if (dbSearchResult) {
      return dbSearchResult;
    }
    const basicMetadata = await extractFileMetadata(filePath);
    const searchTermList = [basicMetadata.title];
    const mediaEntry = await insertMediaEntry({
      userId,
      id: mediaId,
      mediaTitle: basicMetadata.title,
      mediaLocation: filePath,
      category: basicMetadata.category ?? 'MOVIE',
    });

    if (!mediaEntry) {
      return {};
    }

    try {
      if (basicMetadata.releaseYear) {
        searchTermList.push(basicMetadata.releaseYear);
      }
      if (basicMetadata.episodeFullMatch) {
        searchTermList.push(basicMetadata.episodeFullMatch);
      }
      searchTermList.push(basicMetadata.category);
      const searchTerm = searchTermList.join(' ');

      const searchResult = await queryBing(searchTerm).catch((err) => {
        console.error(err);
        return null;
      });
      if (!searchResult) {
        return {};
      }
      const resultList = searchResult?.webPages?.value;
      if (!resultList) {
        return {};
      }
      const imdbResults = extractImdbEntriesFromBingSearch(resultList);
      if (!imdbResults.length) {
        return {};
      }
      const highestMatch = getClosestMatchingImdbTitleId(imdbResults);
      if (!highestMatch?.imdbTitleId) {
        return {};
      }

      if (basicMetadata.episode && basicMetadata.season) {
        const tmdbShowResult = await fetchTmdbEpisodes(highestMatch.imdbTitleId, basicMetadata.season);
        const updatedTVShowEntry = await insertMetadata(
          mediaEntry.id,
          userId,
          highestMatch.imdbTitleId,
          tmdbShowResult?.tvShow,
          tmdbShowResult?.episodes,
          basicMetadata,
        );
        return updatedTVShowEntry || {};
      }

      const tmdbResult = await fetchTmdbEntry(highestMatch.imdbTitleId);
      const updatedMediaEntry = await insertMetadata(mediaEntry.id, userId, highestMatch.imdbTitleId, tmdbResult);
      return updatedMediaEntry || {};
    } catch (err) {
      // rollback transient entry
      await deleteMediaEntry(mediaId);
      return {};
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
