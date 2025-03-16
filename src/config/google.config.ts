export const searchEndpoint = (apiKey: string, searchEngineId: string) =>
  `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}`;

export const knowledgGraphEndpoint = (apiKey: string, limit = 1) =>
  `https://kgsearch.googleapis.com/v1/entities:search?key=${apiKey}&limit=${limit}`;

export const apiKeys = {
  GOOGLE_SEARCH_API_KEY: process.env.GOOGLE_SEARCH_API_KEY,
  GOOGLE_KNOWLEDGE_GRAPH_API_KEY: process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY,
};
