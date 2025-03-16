import { getEpisodesFromTmdbTitle } from '../../config/tmdb.config';
import { TmdbTVShowWithSeasonResult } from '../../types/tmdb-find-results';
import { fetchTmdbEntry } from './fetch-tmdb-entry-activity';

/**
 * Fetches TV show episodes from TMDB using an IMDB title ID and season number
 * @param imdbTitleId - The IMDB title ID
 * @param season - The season number
 * @returns Promise containing the TMDB show and or season result
 */
export async function fetchTmdbEpisodes(
  imdbTitleId: string,
  season?: string,
): Promise<TmdbTVShowWithSeasonResult | null> {
  try {
    console.log('INFO: Fetching TMDB episodes for IMDB title ID:', imdbTitleId);
    const tmdbEntry = await fetchTmdbEntry(imdbTitleId);
    const tmdbId = tmdbEntry?.id;
    if (!tmdbId) {
      return null;
    }
    if (!season) {
      console.log('INFO: Season not provided, fetching TV show only');
      return {
        tvShow: tmdbEntry,
      };
    }
    console.log('INFO: Season data available. Fetching season:', season);
    const tmdbResult = await getEpisodesFromTmdbTitle(tmdbId, season);
    return {
      tvShow: tmdbEntry,
      episodes: tmdbResult,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}