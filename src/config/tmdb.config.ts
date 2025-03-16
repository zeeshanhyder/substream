import { TmdbFindResult, TmdbMovieShape, TmdbSeasonResult, TmdbTVShowShape } from '../types/tmdb-find-results';
/**
 * TMDB API key for authentication
 */
export const TMDB_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmU0NWQxODM3NGE0YTc0ODNkOWFkZDQ4MzBhOWFiMyIsInN1YiI6IjY2NjVjNDFkZmNhZjYwOGU4ODc4ZTRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A_GO6ebKzZSvy6OA8m9q0V-bCBjw3sEhv-Hnt7m1qsY';

/**
 * Base URL for TMDB API endpoints
 */
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetches title information from TMDB using an IMDB title ID.
 *
 * @param imdbTitleId - The IMDB ID of the title to fetch
 * @returns Promise containing the TMDB find result
 * @throws {Error} When the TMDB API request fails
 */
export const getTitleFromImdbTitleId = async (imdbTitleId: string) => {
  try {
    const tmdbResponse = await fetch(`${TMDB_BASE_URL}/find/${imdbTitleId}?external_source=imdb_id`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    const jsonResponse = (await tmdbResponse.json()) as TmdbFindResult;
    return jsonResponse;
  } catch (err) {
    console.error(err);
    return {};
  }
};

/**
 * Fetches detailed media entry information from TMDB.
 *
 * @param tmdbId - The TMDB ID of the media to fetch
 * @param prefix - The type of media ('movie' or 'tv')
 * @returns Promise containing the detailed media information
 * @throws {Error} When the TMDB API request fails
 */
export const fetchTmdbMediaEntry = async (tmdbId: number, prefix: 'movie' | 'tv') => {
  try {
    const tmdbResponse = await fetch(`${TMDB_BASE_URL}/${prefix}/${tmdbId}?append_to_response=videos,images`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    const jsonResponse = await tmdbResponse.json();
    if (prefix === 'tv') {
      return jsonResponse as TmdbTVShowShape;
    }
    return jsonResponse as TmdbMovieShape;
  } catch (err) {
    console.error(err);
    return {};
  }
};

/**
 * Retrieves episode information for a specific season of a TV show from TMDB
 * @param titleId - The TMDB ID of the TV show
 * @param seasonNumber - The season number to fetch episodes for
 * @returns Promise containing the season details or null if error occurs
 */
export const getEpisodesFromTmdbTitle = async (
  titleId: number,
  seasonNumber: string,
): Promise<TmdbSeasonResult | null> => {
  try {
    const tmdbResponse = await fetch(
      `${TMDB_BASE_URL}/tv/${titleId}/season/${seasonNumber}?append_to_response=seasons`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    );
    const jsonResponse = await tmdbResponse.json();
    return jsonResponse as TmdbSeasonResult;
  } catch (err) {
    console.error(err);
    return null;
  }
};
