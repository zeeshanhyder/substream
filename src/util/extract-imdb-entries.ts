import type { BingSearchResultList as SearchResultList } from '../types/bing-media-results';

const isIMDb = (input: SearchResultList[0]) => {
  return input.siteName?.toLowerCase().includes('imdb') || input.name?.toLowerCase().includes('imdb');
};

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
