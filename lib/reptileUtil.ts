interface SearchResult {
  repository: string;
  remote: string;
  branch: string;
  filepath: string;
  linestart: number | null;
  lineend: number | null;
  summary: string;
}

export async function searchReptile(query: string, repositories: any[], sessionId: string): Promise<SearchResult[]> {
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
    const response = await fetch('https://api.greptile.com/v2/search', options);
    
    if (!response.ok) {
      // Handle HTTP error response, e.g., 404, 500
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const responseJson = await response.json();  // Might fail if not valid JSON
    return responseJson;
  } catch (error) {
    console.error('Error during API request or JSON parsing:', error);
    throw error;  // Optionally rethrow or handle differently
  }
}
