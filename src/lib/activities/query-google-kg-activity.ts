import { knowledgGraphEndpoint, apiKeys } from '../../config/google.config';

/**
 * Queries the Google Knowledge Graph API
 * @param query - The search query string
 * @returns Promise<Record<string, unknown>> - The Knowledge Graph API results
 */
export async function queryGoogleKG(query: string): Promise<Record<string, unknown>> {
  try {
    const kgUrl = knowledgGraphEndpoint(apiKeys.GOOGLE_KNOWLEDGE_GRAPH_API_KEY ?? '');
    const res = (await fetch(`${kgUrl}&query=${query}`)).json() as unknown as Record<string, unknown>;
    return res;
  } catch (err) {
    console.error(err);
    return {};
  }
}
