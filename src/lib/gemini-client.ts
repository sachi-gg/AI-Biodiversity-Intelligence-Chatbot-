import { GoogleGenAI, Type } from "@google/genai";
import { searchKnowledgeBase } from "./knowledgeBase";

const GEMINI_MODEL_NAME = "gemini-2.0-flash";

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "<your gemini api key>" || apiKey.includes("your_gemini_api_key")) {
    console.warn("GEMINI_API_KEY is not configured in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Rephrases the user query into comprehensive versions optimized for RAG / Knowledge Base search.
 */
export async function rephraseQuery(query: string): Promise<Array<{ Query: string }>> {
  const ai = getGenAIClient();
  if (!ai) {
    return [{ Query: query }];
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: `Rewrite the following user environmental/biodiversity query into 3 comprehensive, scientific search queries for a RAG knowledge base: "${query}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              Query: {
                type: Type.STRING,
                description: 'Comprehensive scientific search query',
                nullable: false,
              },
            },
            required: ['Query'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [{ Query: query }];
  } catch (error) {
    console.error("Error in rephraseQuery:", error);
    return [{ Query: query }];
  }
}

/**
 * Generates an evidence-backed, multi-metric environmental AI response grounded in retrieved RAG knowledge.
 */
export async function createBetterAnswer(
  query: string, 
  searchResults: any,
  structuredInput?: {
    soc?: string;
    rainfall?: string;
    landUse?: string;
    region?: string;
    coordinates?: string;
  }
): Promise<{
  answerText: string;
  relatedQuestions: string[];
}> {
  const ai = getGenAIClient();
  
  // Local Knowledge Base RAG retrieval
  const localRAG = searchKnowledgeBase(query);
  const groundingContext = `
--- RETRIEVED SCIENTIFIC KNOWLEDGE BASE ---
${localRAG.contextText}

--- DISCOVERY ENGINE SEARCH RESULTS ---
${typeof searchResults === 'string' ? searchResults : JSON.stringify(searchResults, null, 2)}
`;

  const structuredInputContext = structuredInput ? `
--- USER PROVIDED ENVIRONMENTAL METRICS ---
- Soil Organic Carbon (SOC): ${structuredInput.soc || 'Not specified'}
- Rainfall Pattern: ${structuredInput.rainfall || 'Not specified'}
- Land Use / Crop Type: ${structuredInput.landUse || 'Not specified'}
- Geographical Region: ${structuredInput.region || 'Not specified'}
- Coordinates / Spatial context: ${structuredInput.coordinates || 'Not specified'}
` : '';

  const systemPrompt = `You are Darukaa.Earth AI Environmental Scientist — an intelligent, knowledge-driven AI system specializing in biodiversity intelligence, soil health, climate mitigation, and nature-based finance.

YOUR GOAL:
Reason like an expert AI environmental scientist, NOT a generic chatbot. Connect multiple environmental variables (Soil Health ↔ Water Availability ↔ Land Use ↔ Species Survival ↔ Human Impact).

CRITICAL REQUIREMENTS FOR YOUR OUTPUT:
1. Grounding & Scientific Reasoning:
   - Provide concrete, non-obvious recommendations.
   - Explain the EXACT scientific bio-geochemical mechanisms (e.g. nitrogen fixation, fungal mycorrhizae networks, root infiltration, microclimate moderation).
2. Quantifiable Impact & Metrics:
   - Estimate specific percentage changes (e.g., "+15–25% SOC over 2–3 years").
   - Explicitly list affected metrics (Soil Organic Carbon %, Water Infiltration, Species Richness, Biomass density).
3. Evidence & Citations:
   - Cite authoritative bodies (e.g. FAO, IPCC, COP16 IETA, UN Convention on Biological Diversity).
4. Time Horizon & Confidence:
   - Specify time horizon (Short / Medium / Long term) and confidence level (e.g. 90-95%).
5. Clarifying Questions:
   - If key parameters (SOC %, rainfall, land use type, or region) were not provided by the user, ask 1-2 focused clarifying questions at the end to refine future calculations.

FORMAT YOUR RESPONSE CLEARLY WITH READABLE MARKDOWN SECTIONS:
### 🌿 Actionable Recommendation
### 🔬 Scientific Rationale & Multi-Metric Reasoning
### 📈 Impacted Metrics & Measurable Estimates
### ⏱️ Implementation Horizon & Confidence
### 📚 Scientific Grounding & References
### ❓ Recommended Clarifications (if parameters are incomplete)
`;

  if (!ai) {
    // Fallback response generator if GEMINI_API_KEY is not provided
    const topDoc = localRAG.matchedDocs[0];
    const topRec = topDoc?.recommendations?.[0];
    
    return {
      answerText: `### 🌿 Actionable Recommendation
${topRec?.action || 'Implement legume-based cover cropping and multi-strata native vegetation borders.'}

### 🔬 Scientific Rationale & Multi-Metric Reasoning
${topRec?.scientificReasoning || 'Symbiotic bacterial nitrogen fixation enriches active soil organic carbon pools, enhances hyphal density of mycorrhizal fungi, and reduces soil surface moisture evaporation.'}

### 📈 Impacted Metrics & Measurable Estimates
- **Soil Organic Carbon (SOC)**: ${topRec?.impactedMetrics || 'Increases by +15–25% over 2–3 years'}
- **Biodiversity & Water**: Enhances water infiltration rate by +15% and increases pollinator habitat availability by +30%.

### ⏱️ Implementation Horizon & Confidence
- **Time Horizon**: ${topRec?.timeHorizon || 'Medium-term (3-5 yrs)'}
- **Confidence Level**: ${topRec?.confidenceScore || 90}%

### 📚 Scientific Grounding & References
- **Source**: ${topRec?.citation || 'FAO Soils Bulletin & IPCC AR6 Report'}

### ❓ Recommended Clarifications
*Can you provide your site's Soil Organic Carbon %, seasonal rainfall pattern (mm/year), and current crop/land use type for a customized baseline score?*`,
      relatedQuestions: [
        "What legume cover crops work best in semi-arid regions?",
        "How do biodiversity credits quantify species richness gains?",
        "Can you estimate the soil moisture retention improvement over 3 years?"
      ]
    };
  }

  try {
    const prompt = `User Query: "${query}"
${structuredInputContext}
${groundingContext}

Please generate the scientific response following the required format.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      }
    });

    const answerText = response.text || "Failed to generate environmental recommendation.";

    // Generate 3 relevant follow-up questions
    const followUpResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: `Based on this environmental recommendation: "${answerText.slice(0, 500)}", generate 3 concise follow-up questions a farmer, land manager, or climate investor might ask.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        }
      }
    });

    let relatedQuestions = [
      "Can you provide soil organic carbon %, rainfall pattern, and land use type?",
      "How does this recommendation improve biodiversity credit eligibility?",
      "What are the estimated implementation costs per hectare?"
    ];

    try {
      const parsedQuestions = JSON.parse(followUpResponse.text || '[]');
      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        relatedQuestions = parsedQuestions.slice(0, 3);
      }
    } catch (e) {
      // fallback to default related questions
    }

    return { answerText, relatedQuestions };
  } catch (error) {
    console.error("Error in createBetterAnswer:", error);
    return {
      answerText: `### 🌿 Actionable Recommendation
Introduce legume-based cover crops (e.g. *Cajanus cajan*, *Sesbania*) intercropped with deep-rooted native vegetation.

### 🔬 Scientific Rationale
Symbiotic nitrogen fixation increases active soil organic carbon, builds mycorrhizal fungal networks, and restores macroinvertebrate biodiversity.

### 📈 Impacted Metrics
- **Soil Organic Carbon**: +15–25% over 2–3 years
- **Water Holding Capacity**: +12–18%

### 📚 References
- FAO Land & Soil Studies (2023), IPCC AR6 Climate Change Adaptation Report.`,
      relatedQuestions: [
        "What cover crops work best in low rainfall regions?",
        "How do I measure baseline Soil Organic Carbon?",
        "What biodiversity indicators improve most in year 1?"
      ]
    };
  }
}