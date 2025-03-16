import { BingSearchResultList } from '../types/bing-media-results';

/**
 * Finds the top matching IMDb link from a list of Bing search results.
 *
 * @param imdbSearchResultList - The list of Bing search results
 * @returns {string} The top matching IMDb link
 */
const getTopMatchingImdbLink = (imdbSearchResultList: BingSearchResultList): string => {
  const imdbSearchListWithRank = imdbSearchResultList.reduce(
    (partialResult, currentResult) => {
      const { displayUrl } = currentResult;
      if (displayUrl) {
        const searchItem = partialResult[displayUrl];
        if (searchItem === undefined) {
          return {
            ...partialResult,
            [displayUrl]: 1,
          };
        }
        partialResult[displayUrl] = searchItem + 1;
        return partialResult;
      }
      return partialResult;
    },
    {} as Record<string, number>,
  );

  let maxRankedTitle: string = '';
  let maxRank: number = 0;
  for (const [imdbTitle, titleRank] of Object.entries(imdbSearchListWithRank)) {
    if (titleRank > maxRank) {
      maxRank = titleRank;
      maxRankedTitle = imdbTitle;
    }
  }

  return maxRankedTitle;
};

/**
 * Finds the closest matching IMDb title ID from a list of Bing search results.
 *
 * @param imdbSearchResultList - The list of Bing search results
 * @returns {string} The closest matching IMDb title ID
 */
export const getClosestMatchingImdbTitleId = (imdbSearchResultList: BingSearchResultList) => {
  const imdbLink = getTopMatchingImdbLink(imdbSearchResultList);
  const titleRegexp = new RegExp(/tt[0-9]+/);

  const [imdbTitleId] = imdbLink.split('/').filter((partialString) => titleRegexp.test(partialString));

  if (!imdbTitleId) {
    return { imdbTitleId: '' };
  }
  console.log('INFO: Found closest matching IMDb title ID', imdbTitleId);
  return { imdbTitleId };
};
