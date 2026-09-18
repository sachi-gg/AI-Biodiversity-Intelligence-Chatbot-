# Darukaa.Earth — AI Biodiversity & Environmental Intelligence

An AI-powered environmental reasoning system built for the **Darukaa.Earth AI Biodiversity Intelligence Chatbot Challenge**.

Darukaa.Earth is designed to behave as an **AI environmental scientist**, combining multiple environmental variables with a retrieval-augmented knowledge system to generate actionable, evidence-backed recommendations for improving biodiversity and ecosystem health.

The system connects **soil health, water availability, land use, climate conditions, biodiversity indicators, and human impacts** rather than treating each variable independently.

---

## What It Does

Given natural-language and structured environmental inputs, Darukaa.Earth:

* Understands environmental conditions and user objectives
* Retrieves relevant scientific knowledge from a dedicated RAG layer
* Connects multiple environmental variables to identify relationships and constraints
* Generates actionable interventions rather than generic sustainability advice
* Explains the scientific mechanism behind each recommendation
* Identifies which environmental metrics are expected to change
* Provides an implementation time horizon and confidence estimate
* Asks follow-up questions when important environmental parameters are missing
* Maintains conversational context across multiple turns

---

## Core Capabilities

### Multi-Metric Environmental Reasoning

The system evaluates environmental variables together, including:

* Soil organic carbon
* Soil pH
* Soil moisture
* Rainfall
* Temperature
* Land use / land cover
* Species richness
* Habitat diversity
* Pollution
* Deforestation and other human impacts

For example:

```text
Low soil organic carbon
        +
Low rainfall
        +
Monoculture agriculture
        +
Semi-arid climate
        ↓
Reduced soil resilience
        ↓
Lower habitat and resource diversity
        ↓
Biodiversity pressure
        ↓
Targeted intervention
```

This multi-variable reasoning is a core part of the system rather than a single-variable recommendation engine.

---

## Knowledge & RAG System

Darukaa.Earth uses a dedicated knowledge layer rather than relying solely on an LLM prompt.

### Retrieval Pipeline

```text
User Query + Environmental Parameters
                │
                ▼
        Query Understanding
                │
                ▼
       Knowledge Retrieval
          ┌─────┴─────┐
          ▼           ▼
   Vertex AI Search   Scientific
   / Discovery       Knowledge Base
      Engine
          │           │
          └─────┬─────┘
                ▼
        Retrieved Evidence
                │
                ▼
       Gemini Reasoning Layer
                │
                ▼
    Multi-Metric Recommendation
                │
                ▼
   Evidence + Metrics + Time Horizon
```

### Knowledge Sources

The knowledge layer includes research and reports covering:

* Soil and land management
* Biodiversity
* Climate impacts
* Carbon and nature markets
* Semi-arid ecosystems
* Biodiversity conservation
* Adaptation and environmental management

Sources include material from organizations such as:

* Food and Agriculture Organization (FAO)
* Intergovernmental Panel on Climate Change (IPCC)
* Convention on Biological Diversity (UN CBD)
* COP16 biodiversity-related reports
* Environmental and land-management research

---

## Evidence-Backed Recommendations

Recommendations are structured around four questions:

### 1. What should be done?

A specific intervention rather than a generic sustainability statement.

### 2. Why should it work?

The system explains the underlying ecological or biogeochemical mechanism.

### 3. What changes?

Relevant environmental metrics are identified, such as:

* Soil organic carbon
* Soil moisture
* Species richness
* Habitat diversity
* Water availability
* Pollinator abundance

### 4. When should an effect be expected?

Recommendations include an implementation horizon:

* Short term
* Medium term
* Long term

Where sufficient evidence exists, the response also provides quantitative estimates and their supporting source.

---

## Example Reasoning

### Input

```text
Soil organic carbon: 0.3%
Rainfall: Low
Crop: Monoculture wheat
Region: Semi-arid
```

### Reasoning

The system can connect:

```text
Low SOC
  ↓
Lower soil structure and water retention

Low rainfall
  ↓
High water limitation

Monoculture
  ↓
Low habitat and resource diversity

Semi-arid climate
  ↓
High sensitivity to soil moisture loss
```

The resulting recommendation can therefore consider interventions such as **intercropping, cover crops, or agroforestry**, depending on the retrieved evidence and environmental context.

The response explains the mechanisms involved and identifies the environmental metrics that the intervention is expected to influence.

---

## Conversational Intelligence

The system supports multi-turn environmental conversations.

For incomplete inputs, it can request the parameters required for meaningful reasoning.

### Example

**User:**

> Biodiversity is declining on my land.

**System:**

> To identify likely drivers, provide your approximate soil organic carbon, rainfall pattern, land-use type, and region. If available, also provide soil pH and recent changes in vegetation or species richness.

The system then uses the information supplied in subsequent turns as conversational context.

---

## Input Handling

### Natural Language

```text
"Biodiversity has declined on my farm after several years
of monoculture wheat cultivation."
```

### Structured Input

```json
{
  "soilOrganicCarbon": 0.3,
  "rainfall": "low",
  "crop": "wheat",
  "landUse": "monoculture",
  "region": "semi-arid"
}
```

### Spatial Context

The system can also accept geographic coordinates where available, allowing environmental recommendations to incorporate regional context.

---

## Response Structure

Responses are organized into clear sections:

```text
Recommendation
────────────────────────
Specific action to take

Scientific Reasoning
────────────────────────
Why the intervention should work

Impacted Metrics
────────────────────────
• Soil organic carbon
• Soil moisture
• Biodiversity / habitat indicators

Time Horizon
────────────────────────
Short / Medium / Long term

Confidence
────────────────────────
Confidence based on available evidence

Scientific Evidence
────────────────────────
Relevant reports, studies, or datasets

Clarifications
────────────────────────
Additional parameters required, if any
```

---

## Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                     Next.js 15 Frontend                      │
│                                                              │
│  Conversational Interface + Structured Environmental Inputs  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js API /api/chat                     │
│                                                              │
│        Query Processing + Context + RAG Orchestration        │
└──────────────────────────────┬───────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
┌───────────────────────────┐   ┌──────────────────────────────┐
│ Vertex AI Search          │   │ Scientific Knowledge Base    │
│ / Discovery Engine        │   │                              │
│                           │   │ Curated environmental        │
│ Indexed research reports  │   │ knowledge and evidence       │
└──────────────┬────────────┘   └──────────────┬───────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
                ┌─────────────────────────────┐
                │       Google Gemini         │
                │                             │
                │ Scientific Reasoning        │
                │ Evidence Synthesis          │
                │ Recommendation Generation   │
                └──────────────┬──────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │ Structured Environmental    │
                │ Recommendation              │
                └─────────────────────────────┘
```

---

## Technology Stack

| Component       | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js 15, React, TypeScript            |
| Styling         | Tailwind CSS                             |
| UI Components   | Radix UI, Lucide React                   |
| Reasoning Model | Google Gemini                            |
| Retrieval       | Vertex AI Search / Discovery Engine      |
| Knowledge Layer | Curated scientific environmental dataset |
| Deployment      | Vercel / Google Cloud Run                |

---

## Project Structure

```text
darukaa-bio-knowledge-rag/
├── files/                         # Environmental research documents
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # RAG + chat API
│   │   ├── page.tsx               # Main interface
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   └── chat-interface.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/
│   │   ├── gemini-client.ts       # Gemini integration
│   │   ├── discoveryEngine.ts     # Vertex AI Search
│   │   └── knowledgeBase.ts       # Scientific knowledge layer
│   │
│   └── types/
│       └── chat.ts
│
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 20+
* npm
* Gemini API key
* Google Cloud project for Vertex AI Search integration

### Installation

```bash
git clone https://github.com/sachi-gg/AI-Biodiversity-Intelligence-Chatbot-.git
cd AI-Biodiversity-Intelligence-Chatbot-

npm install
```

### Environment Variables

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key

# Vertex AI Search
GCP_PROJECT_ID=your_project_id
GCP_LOCATION=eu
GCP_COLLECTION_ID=default_collection
GCP_ENGINE_ID=your_engine_id
GCP_SERVING_CONFIG_ID=default_search
```

Never commit `.env.local` or API credentials to the repository.

### Run Locally

```bash
npm run dev
```

The application runs at:

```text
http://localhost:9002
```

---

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy.

For Vertex AI Search, the required Google Cloud credentials and configuration must also be available in the deployment environment.

---

## Challenge Alignment

| Requirement                     | Implementation                                   |
| ------------------------------- | ------------------------------------------------ |
| Retrievable knowledge layer     | Vertex AI Search + scientific knowledge base     |
| Soil health                     | SOC, pH, moisture                                |
| Land use / land cover           | Structured environmental inputs                  |
| Biodiversity indicators         | Species richness, habitat diversity              |
| Climate                         | Rainfall, temperature, regional conditions       |
| Human impacts                   | Pollution, deforestation and land-use context    |
| Multi-variable reasoning        | Gemini reasoning across environmental parameters |
| Clarifying questions            | Missing-parameter detection                      |
| Multi-turn context              | Conversational state                             |
| Evidence-backed recommendations | Retrieved scientific sources                     |
| Structured input                | JSON/environmental parameter controls            |
| Spatial context                 | Geographic coordinates                           |
| Actionable outputs              | Recommendation + metrics + timeline              |
| Scientific reasoning            | Biogeochemical and ecological explanations       |
