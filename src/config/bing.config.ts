export const BING_API_KEY = process.env.BING_API_KEY;
export const CUSTOM_SEARCH_ENGINE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID;

export const buildBingSearch =
  (apiKey = '', searchEngineId = '') =>
  async <T>(query = '') => {
    try {
      const res = await fetch(
        `https://api.bing.microsoft.com/v7.0/custom/search?q=${query}&customconfig=${searchEngineId}`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
          },
        },
      );
      return res.json() as Promise<T>;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
