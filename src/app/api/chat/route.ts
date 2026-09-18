import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { searchDiscoveryEngine, answerDiscoveryEngine } from '@/lib/discoveryEngine';
import { createBetterAnswer, rephraseQuery } from '@/lib/gemini-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, structuredInput } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'A valid query string is required.' }, { status: 400 });
    }

    // 1. Expand and rephrase query for scientific search
    const rephrasedQueries = await rephraseQuery(query);
    const searchQuery = rephrasedQueries[0]?.Query || query;

    let discoveryResults: any = null;

    // 2. Attempt Google Vertex AI Discovery Engine search if configured
    const searchResponse = await searchDiscoveryEngine(searchQuery);
    if (searchResponse && searchResponse.queryId && searchResponse.session) {
      discoveryResults = await answerDiscoveryEngine(query, searchResponse.queryId, searchResponse.session);
    }

    // 3. Generate scientifically grounded response via Gemini + RAG Knowledge Engine
    const { answerText, relatedQuestions } = await createBetterAnswer(
      query, 
      discoveryResults || searchQuery, 
      structuredInput
    );

    const responsePayload = {
      answer: {
        answerText,
        relatedQuestions: relatedQuestions || [],
      },
      rephrasedQueries: rephrasedQueries.map(q => q.Query),
      grounded: true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with the chat service.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
