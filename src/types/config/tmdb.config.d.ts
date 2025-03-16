import { TmdbFindResult, TmdbMovieShape, TmdbSeasonResult, TmdbTVShowShape } from '../types/tmdb-find-results';
/**
 * TMDB API key for authentication
 */
export declare const TMDB_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmU0NWQxODM3NGE0YTc0ODNkOWFkZDQ4MzBhOWFiMyIsInN1YiI6IjY2NjVjNDFkZmNhZjYwOGU4ODc4ZTRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A_GO6ebKzZSvy6OA8m9q0V-bCBjw3sEhv-Hnt7m1qsY';
/**
 * Base URL for TMDB API endpoints
 */
export declare const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
/**
 * Fetches title information from TMDB using an IMDB title ID.
 *
 * @param imdbTitleId - The IMDB ID of the title to fetch
 * @returns Promise containing the TMDB find result
 * @throws {Error} When the TMDB API request fails
 */
export declare const getTitleFromImdbTitleId: (imdbTitleId: string) => Promise<TmdbFindResult>;
/**
 * Fetches detailed media entry information from TMDB.
 *
 * @param tmdbId - The TMDB ID of the media to fetch
 * @param prefix - The type of media ('movie' or 'tv')
 * @returns Promise containing the detailed media information
 * @throws {Error} When the TMDB API request fails
 */
export declare const fetchTmdbMediaEntry: (
  tmdbId: number,
  prefix: 'movie' | 'tv',
) => Promise<TmdbMovieShape | TmdbTVShowShape>;
/**
 * Retrieves episode information for a specific season of a TV show from TMDB
 * @param titleId - The TMDB ID of the TV show
 * @param seasonNumber - The season number to fetch episodes for
 * @returns Promise containing the season details or null if error occurs
 */
export declare const getEpisodesFromTmdbTitle: (
  titleId: number,
  seasonNumber: string,
) => Promise<TmdbSeasonResult | null>;
//# sourceMappingURL=tmdb.config.d.ts.map
