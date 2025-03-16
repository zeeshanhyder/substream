import { IMediaEntity } from '../models/media-entity';
import { IntermediateMetadata } from '../types/media-metadata';
import { type TmdbFindResult, type TmdbEpisodeShape } from '../types/tmdb-find-results';
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
export declare const filterTmdbResult: (tmdbSearchResults: TmdbFindResult) => TmdbFilteredResult;
/**
 * Maps episode data to a media entry model.
 *
 * @param id - Unique identifier for the media entry
 * @param imdbId - IMDB identifier for the TV show
 * @param mediaInfo - Existing media entity information (if any)
 * @param basicMetadata - Basic metadata including episode and season information
 * @param episodeNumber - Episode number in the season
 * @param seasonNumber - Season number of the TV show
 * @param episode - Episode data from TMDB
 * @returns {IMediaEntity} A new media entity with episode information
 */
export declare const mapEpisodeToMediaEntry: (
  id: string,
  imdbId: string,
  mediaInfo: IMediaEntity | null,
  basicMetadata: IntermediateMetadata,
  episodeNumber: number,
  seasonNumber: number,
  episode?: TmdbEpisodeShape,
) => IMediaEntity;
export {};
//# sourceMappingURL=filter-tmdb-result.d.ts.map
