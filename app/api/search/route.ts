import { NextResponse } from 'next/server';
import { searchReptile } from '@/lib/reptileUtil';
import 'dotenv/config'

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { query, repositories, sessionId } = body;

    const results = await searchReptile(query, repositories, sessionId);
    return NextResponse.json(results);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}