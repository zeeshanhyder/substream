import { fetchTmdbMediaEntry, getTitleFromImdbTitleId } from '../../config/tmdb.config';
import { isTVShow } from '../../types/tmdb-find-results';
import { filterTmdbResult } from '../../util/filter-tmdb-result';

/**
 * Fetches TMDB media entry using an IMDB title ID
 * @param imdbTitleId - The IMDB title ID
 * @returns Promise containing the filtered TMDB result
 */
export async function fetchTmdbEntry(imdbTitleId: string) {
  try {
    console.log('INFO: Fetching TMDB entry for IMDB title ID:', imdbTitleId);
    const tmdbResult = await getTitleFromImdbTitleId(imdbTitleId);
    const { tmdbId, mediaType } = filterTmdbResult(tmdbResult);
    if (!tmdbId) {
      console.log('ERROR: Failed to fetch TMDB ID from IMDb ID');
      return undefined;
    }
    const tmdbMedia = await fetchTmdbMediaEntry(tmdbId, mediaType);
    const mediaTitle = isTVShow(tmdbMedia) ? tmdbMedia.name : tmdbMedia.title;
    console.log('INFO: Fetched TMDB entry:', `${tmdbId} - ${mediaTitle}`);
    return tmdbMedia;
  } catch (err) {
    console.error(err);
    return {};
  }
}
