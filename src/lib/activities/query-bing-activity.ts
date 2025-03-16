import { BING_API_KEY, buildBingSearch as createBingInstance, CUSTOM_SEARCH_ENGINE_ID } from '../../config/bing.config';
import type { BingMediaResult } from '../../types/bing-media-results';

/**
 * Performs a Bing search query
 * @param query - The search query string
 * @returns Promise<BingMediaResult> - The Bing search results
 */
export async function queryBing(query: string): Promise<BingMediaResult> {
  try {
    console.log('INFO: Searching IMDb for title:', query);
    const searchBing = createBingInstance(BING_API_KEY, CUSTOM_SEARCH_ENGINE_ID);
    const bingResult = await searchBing<BingMediaResult>(query);
    return bingResult;
  } catch (err) {
    throw err;
  }
}