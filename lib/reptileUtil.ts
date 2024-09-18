/**
 * @file reptileUtil.ts
 * @description This file contains utility functions and interfaces for interacting with the Greptile API.
 * It provides a type-safe way to search for code snippets across GitHub repositories.
 * 
 * The main export is the `searchReptile` function, which performs a search query against
 * specified GitHub repositories using the Greptile API.
 * 
 * @requires process.env.GREPTILE_API_TOKEN to be set with a valid Greptile API token
 * @requires process.env.GITHUB_API_KEY to be set with a valid GitHub API key
*/

/**
 * Represents the structure of a search result from the Greptile API.
 */
interface SearchResult {
  /** The name of the repository */
  repository: string;
  /** The remote source of the repository (e.g., 'github') */
  remote: string;
  /** The branch of the repository where the result was found */
  branch: string;
  /** The file path where the result was found */
  filepath: string;
  /** The starting line number of the result in the file (null if not applicable) */
  linestart: number | null;
  /** The ending line number of the result in the file (null if not applicable) */
  lineend: number | null;
  /** A summary or snippet of the search result */
  summary: string;
}

interface repoObject {
  repository: string;
  remote: string;
  branch: string;
}

/**
 * Searches for a query in specified GitHub repositories using the Greptile API.
 * 
 * @param query - The search query string.
 * @param repositories - An array of repository objects to search in.
 * @returns A promise that resolves to an array of SearchResult objects.
 * @throws Will throw an error if the API request fails or returns a non-OK status.
 */
export async function searchReptile(query: string, repositories: repoObject[]): Promise<SearchResult[]> {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GREPTILE_API_TOKEN}`,
      'X-GitHub-Token': `${process.env.GITHUB_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, repositories })
  };

  try {
    const response: Response = await fetch('https://api.greptile.com/v2/search', options);
    
    if (!response.ok) {
      // Handle HTTP error response, e.g., 404, 500
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const responseJson: SearchResult[] = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Error during API request or JSON parsing:', error);
    throw error;  // Rethrow the error for handling in the calling function
  }
}
