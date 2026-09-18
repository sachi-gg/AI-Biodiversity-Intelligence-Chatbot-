import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PROJECT_ID = process.env.GCP_PROJECT_ID || '194113201958';
const LOCATION = process.env.GCP_LOCATION || 'eu';
const COLLECTION_ID = process.env.GCP_COLLECTION_ID || 'default_collection';
const ENGINE_ID = process.env.GCP_ENGINE_ID || 'darukaa-knowledge-hub-app_1747299091695';
const SERVING_CONFIG_ID = process.env.GCP_SERVING_CONFIG_ID || 'default_search';

const SEARCH_URL = `https://${LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${LOCATION}/collections/${COLLECTION_ID}/engines/${ENGINE_ID}/servingConfigs/${SERVING_CONFIG_ID}:search`;
const ANSWER_URL = `https://${LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${LOCATION}/collections/${COLLECTION_ID}/engines/${ENGINE_ID}/servingConfigs/${SERVING_CONFIG_ID}:answer`;

/**
 * Searches Google Vertex AI Discovery Engine for document matches.
 * Returns null if authentication or service is unavailable (enables clean fallback to local RAG).
 */
export async function searchDiscoveryEngine(query: string): Promise<{ queryId: string; session: string } | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return null;
    }

    const response = await fetch(SEARCH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        pageSize: 5,
        queryExpansionSpec: { condition: 'AUTO' },
        spellCorrectionSpec: { mode: 'AUTO' },
        languageCode: 'en-US',
        contentSearchSpec: { extractiveContentSpec: { maxExtractiveAnswerCount: 1 } },
        userInfo: { timeZone: 'Europe/Berlin' },
        session: `projects/${PROJECT_ID}/locations/${LOCATION}/collections/${COLLECTION_ID}/engines/${ENGINE_ID}/sessions/-`,
      }),
    });

    if (!response.ok) {
      console.warn(`Discovery Engine Search returned status ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    const session = data.sessionInfo;

    if (!session || !session.name || !session.queryId) {
      return null;
    }

    return { queryId: session.queryId, session: session.name };
  } catch (error) {
    console.warn("Discovery Engine Search unavailable, switching to grounded RAG:", (error as Error).message);
    return null;
  }
}

/**
 * Generates an answer via Discovery Engine API.
 */
export async function answerDiscoveryEngine(query: string, queryId: string, session: string): Promise<any | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const response = await fetch(ANSWER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { text: query, queryId: queryId },
        session: session,
        relatedQuestionsSpec: { enable: true },
        answerGenerationSpec: {
          ignoreAdversarialQuery: true,
          ignoreNonAnswerSeekingQuery: false,
          ignoreLowRelevantContent: true,
          multimodalSpec: {},
          includeCitations: true,
          modelSpec: { modelVersion: 'stable' }
        }
      })
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Discovery Engine Answer API error:", (error as Error).message);
    return null;
  }
}

/**
 * Helper to obtain access token safely without crashing serverless hosting environments.
 */
async function getAccessToken(): Promise<string | null> {
  // Option 1: Access token passed via ENV variable (ideal for Vercel/Render deployments)
  if (process.env.GCP_ACCESS_TOKEN) {
    return process.env.GCP_ACCESS_TOKEN.trim();
  }

  // Option 2: Try gcloud CLI local fallback
  try {
    const { stdout } = await execAsync('gcloud auth print-access-token');
    return stdout.trim();
  } catch {
    // Silent fallback to standard Gemini RAG engine when gcloud CLI is absent
    return null;
  }
}
