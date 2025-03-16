import { nanoid } from 'nanoid';
import { IMediaEntity, MediaEntityModel } from '../../models/media-entity';
import { IntermediateMetadata } from '../../types/media-metadata';
import { TmdbSeasonResult, TmdbTVShowShape } from '../../types/tmdb-find-results';
import { mapEpisodeToMediaEntry } from '../../util/filter-tmdb-result';
import { databaseInstance } from '../mongoose-client';
import { insertMediaMetadata } from './insert-media-metadata-activity';
import { queryDB } from './query-db-activity';
import { insertMediaEntry } from './insert-media-entry-activity';
import { ApplicationFailure } from '@temporalio/activity';

/**
 * Inserts metadata for episodes into the database. This function handles the complex logic of managing
 * TV show episodes, including creating new shows, seasons, and episodes or updating existing ones.
 *
 * @param mediaId - Unique identifier for the media entry
 * @param userId - Unique identifier of the user to whom the media entry belongs
 * @param basicMetadata - Basic metadata information including episode and season numbers
 * @param imdbId - The IMDB identifier for the TV show
 * @param tmdbResult - The TMDB result containing TV show data
 * @param tmdbSeasonResult - The TMDB result containing specific season and episode data
 * @returns Promise<IMediaEntity | null> - Returns the created/updated media entry or null
 * @throws {ApplicationFailure} When database connection fails
 * @throws {ApplicationFailure} When episode or season numbers are missing
 * @throws {ApplicationFailure} When TMDB result is invalid
 * @throws {ApplicationFailure} When database operations fail
 */
export async function insertEpisodesMetadata(
  mediaId: string,
  userId: string,
  basicMetadata: IntermediateMetadata,
  imdbId: string,
  tmdbResult: TmdbTVShowShape,
  tmdbSeasonResult: TmdbSeasonResult,
) {
  const db = databaseInstance.getDb();
  if (!db) {
    throw ApplicationFailure.create({
      message: 'Database connection unavailable',
      type: 'CONNECTION_ERROR',
      nonRetryable: false, // Allow Temporal to retry
    });
  }

  try {
    const { episode: episodeNumber = '', season: seasonNumber = '' } = basicMetadata;
    if (!episodeNumber || !seasonNumber) {
      throw ApplicationFailure.create({
        message: 'Missing episode or season number',
        type: 'VALIDATION_ERROR',
        nonRetryable: true, // Don't retry for invalid data
      });
    }

    const seasonNumberFormatted = Number(seasonNumber);
    const episodeNumberFormatted = Number(episodeNumber);

    let currentSeason:
      | {
          id: string;
          name: string;
          shortName: string;
          summary: string;
          seasonNumber: number;
          episodes: Array<IMediaEntity>;
        }
      | null
      | undefined;
    let currentEpisode: IMediaEntity | undefined | null;

    let tvShow = await queryDB({ 'metadata.tmdbId': String(tmdbResult?.id ?? ''), userId });
    const currentlySavedEpisodeData = await queryDB({ id: mediaId, userId });

    if (!tmdbResult?.id) {
      throw ApplicationFailure.create({
        message: 'Invalid TMDB result',
        type: 'DATA_ERROR',
        nonRetryable: true,
      });
    }

    if (tvShow) {
      console.log('INFO: TV show already present in DB');
      currentSeason = (tvShow.seasons ?? []).find((season) => season.seasonNumber === seasonNumberFormatted);
      currentEpisode = currentSeason?.episodes?.find((episode) => episode.episodeNumber === episodeNumberFormatted);
    } else {
      console.log('INFO: TV show not present in DB. Creating new entry');
      const tvShowId = nanoid();
      tvShow = await insertMediaEntry({
        id: tvShowId,
        mediaTitle: tmdbResult?.name ?? '',
        mediaLocation: '',
        category: 'TV',
        userId,
      });
      tvShow = await insertMediaMetadata(tvShowId, userId, imdbId, tmdbResult);
    }

    if (currentSeason) {
      console.log('INFO: Season already present in DB. Not adding again.');
      if (currentEpisode === undefined || currentEpisode === null) {
        console.log('INFO: Episode not present in DB. Creating new entry');
        let episodeList = currentSeason?.episodes;
        const newEpisodeMetadata = tmdbSeasonResult.episodes?.filter(
          (episode) => Number(episode.episode_number) === episodeNumberFormatted,
        );
        const newEpisodeEntry: IMediaEntity = mapEpisodeToMediaEntry(
          mediaId,
          userId,
          imdbId,
          currentlySavedEpisodeData,
          basicMetadata,
          episodeNumberFormatted,
          seasonNumberFormatted,
          newEpisodeMetadata?.[0],
        );
        episodeList?.push(newEpisodeEntry);
        episodeList = episodeList?.sort((a, b) => (a?.episodeNumber ?? 0) - (b?.episodeNumber ?? 0));
        const updatedSeason = {
          ...currentSeason,
          episodes: episodeList,
        };
        const updatedSeasons = tvShow?.seasons?.map((season) =>
          season.seasonNumber === seasonNumberFormatted ? updatedSeason : season,
        );
        let res;
        // Wrap database operations in try-catch
        try {
          res = await MediaEntityModel.findOneAndUpdate(
            { id: tvShow?.id ?? '' },
            { seasons: updatedSeasons },
            { new: true },
          );
          await MediaEntityModel.deleteOne({ id: mediaId });
        } catch (error: unknown) {
          const isGenericError = error instanceof Error;
          throw ApplicationFailure.create({
            message: `Database operation failed: ${isGenericError ? error.message : ''}`,
            type: 'DB_ERROR',
            cause: isGenericError ? error : new Error('Unknown error'),
            nonRetryable: false,
          });
        }
        console.log('INFO: Episode entry created');
        return res ? (res.toJSON() as IMediaEntity) : null;
      } else {
        console.log('INFO: Episode already present in DB. Not adding again.');
        // remove transient entry
        await MediaEntityModel.deleteOne({ id: mediaId });
        return tvShow;
      }
    } else {
      console.log('INFO: Season not present in DB. Creating new entry');
      const filterAvailableEpisodeMetadata = tmdbSeasonResult.episodes?.filter(
        (episode) => episode.episode_number === episodeNumberFormatted,
      );
      const newSeasonEntry = {
        id: `${tvShow?.id ?? ''}-${seasonNumberFormatted}`,
        name: tmdbSeasonResult.name ?? '',
        shortName: tmdbSeasonResult.name ?? '',
        summary: tmdbSeasonResult.overview ?? '',
        seasonNumber: seasonNumberFormatted,
        episodes: [
          mapEpisodeToMediaEntry(
            mediaId,
            userId,
            imdbId,
            currentlySavedEpisodeData,
            basicMetadata,
            episodeNumberFormatted,
            seasonNumberFormatted,
            filterAvailableEpisodeMetadata?.[0],
          ),
        ],
      };
      const existingSeasons = tvShow?.seasons ?? [];
      existingSeasons?.push(newSeasonEntry);
      // remove transient entry
      await MediaEntityModel.deleteOne({ id: mediaId });
      const updatedEntry = await MediaEntityModel.findOneAndUpdate(
        { id: tvShow?.id ?? '' },
        { seasons: existingSeasons },
        { new: true },
      );
      console.log('INFO: Season and episode entry created');
      return updatedEntry ? (updatedEntry.toJSON() as IMediaEntity) : null;
    }
  } catch (error) {
    if (error instanceof ApplicationFailure) {
      throw error;
    }
    const isGenericError = error instanceof Error;
    throw ApplicationFailure.create({
      message: `Episode metadata insertion failed: ${isGenericError ? error.message : 'Unknown error'}`,
      type: 'UNKNOWN_ERROR',
      cause: isGenericError ? error : new Error('Unknown error'),
      nonRetryable: false,
    });
  }
}
