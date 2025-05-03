import { getYoutubeTrailerLink } from '../lib/utils';
import { IMediaEntity, IMetadata, MediaEntityModel } from '../models/media-entity';
import { IntermediateMetadata } from '../types/media-metadata';
import {
  type TmdbFindResult,
  type TmdbMovieShape,
  type TmdbTVShowShape,
  type TmdbEpisodeShape,
  isTVShow,
  isEpisode,
} from '../types/tmdb-find-results';

type TmdbFilteredResult = {
  tmdbId?: number;
  mediaType: 'tv' | 'movie';
};

/**
 * Filters and processes TMDB search results to determine the media type and ID.
 *
 * @param tmdbSearchResults - The raw search results from TMDB API
 * @returns {TmdbFilteredResult} An object containing the TMDB ID and media type
 */
export const filterTmdbResult = (tmdbSearchResults: TmdbFindResult): TmdbFilteredResult => {
  let filteredResult: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape = {};
  for (const mediaList of Object.values(tmdbSearchResults)) {
    if (mediaList.length > 0) {
      filteredResult = mediaList[0];
    }
  }
  if (isTVShow(filteredResult)) {
    return {
      tmdbId: filteredResult.id,
      mediaType: 'tv',
    };
  }
  if (isEpisode(filteredResult)) {
    return {
      tmdbId: filteredResult.show_id,
      mediaType: 'tv',
    };
  }
  return {
    tmdbId: filteredResult.id,
    mediaType: 'movie',
  };
};

/**
 * Maps episode data to a media entry model.
 *
 * @param id - Unique identifier for the media entry
 * @param userId - User identifier for the media entry (Owner of media entry)
 * @param imdbId - IMDB identifier for the TV show
 * @param mediaInfo - Existing media entity information (if any)
 * @param basicMetadata - Basic metadata including episode and season information
 * @param episodeNumber - Episode number in the season
 * @param seasonNumber - Season number of the TV show
 * @param episode - Episode data from TMDB
 * @returns {IMediaEntity} A new media entity with episode information
 */
export const mapEpisodeToMediaEntry = (
  id: string,
  userId: string,
  imdbId: string,
  mediaInfo: IMediaEntity | null,
  basicMetadata: IntermediateMetadata,
  episodeNumber: number,
  seasonNumber: number,
  episode?: TmdbEpisodeShape,
  show?: TmdbTVShowShape,
): IMediaEntity => {
  return new MediaEntityModel({
    id,
    userId,
    mediaTitle: episode?.name ?? mediaInfo?.mediaTitle ?? '',
    category: 'TV',
    mediaLocation: mediaInfo?.mediaLocation ?? '',
    streamId: mediaInfo?.streamId ?? '',
    simpleId: basicMetadata.episodeFullMatch,
    episodeNumber,
    seasonNumber,
    metadata: {
      imdbId,
      title: episode?.name ?? '',
      summary: episode?.overview ?? '',
      tmdbId: String(episode?.id ?? 0),
      releaseDate: String(episode?.air_date) ?? '',
      rating: [{ name: 'TMDB', rating: String(episode?.vote_average ?? 0) }],
      duration: (episode?.runtime ?? 0) * 60,
      thumbnailImage: show?.poster_path,
      posterImage: show?.poster_path,
      parentTmdbId: show?.id,
      backdropImage: show?.backdrop_path,
      titleImage: show?.images?.logos?.[0]?.file_path ?? '',
      stillPath: episode?.still_path,
      trailerLink: show ? getYoutubeTrailerLink(show) : '',
      generes: show?.genres?.map((genre) => genre.name) ?? [],
    },
  });
};
