import type { BingSearchResultList as SearchResultList } from '../types/bing-media-results';

/**
 * Determines if a search result is from IMDb based on site name or content
 * @param input - Single search result item
 * @returns Boolean indicating if the result is from IMDb
 */
const isIMDb = (input: SearchResultList[0]) => {
  return input.siteName?.toLowerCase().includes('imdb') || input.name?.toLowerCase().includes('imdb');
};

/**
 * Filters search results to only include IMDb entries
 * @param searchResultList - List of search results from Bing
 * @returns Array of IMDb-related search results
 */
export const extractImdbEntriesFromBingSearch = (searchResultList: SearchResultList): SearchResultList[0][] => {
  if (!searchResultList.length) {
    return [];
  }
  const imdbList = searchResultList.filter(isIMDb);

  if (!imdbList.length) {
    console.warn('WARN: No IMDB results found');
    return [];
  }
  console.log('IMDb results found:', imdbList.length);
  return imdbList;
};
