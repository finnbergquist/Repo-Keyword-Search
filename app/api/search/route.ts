/**
 * @file route.ts
 * @description This file defines the API route handler for the search functionality.
 * It processes POST requests to perform searches using the Greptile API.
 */

import { NextResponse } from 'next/server';
import { searchReptile } from '@/lib/reptileUtil';
import 'dotenv/config'

/**
 * Handles POST requests to the /api/search endpoint.
 * 
 * This function processes search requests by extracting the query parameters
 * from the request body and using the searchReptile utility function to
 * perform the search. It then returns the results as a JSON response.
 * 
 * @param request - The incoming HTTP request object.
 * @returns A Promise that resolves to a NextResponse object containing
 *          either the search results or an error message.
 */
export async function POST(request: Request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();

    // Extract the required parameters from the request body
    const { query, repositories } = body;

    // Perform the search using the searchReptile utility function
    const results = await searchReptile(query, repositories);

    // Return the search results as a JSON response
    return NextResponse.json(results);
  } catch (error) {
    // If an error occurs, construct an error message
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';

    // Return the error message with a 500 status code
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}