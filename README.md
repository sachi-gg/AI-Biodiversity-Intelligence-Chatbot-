# Darukaa.Earth — AI Biodiversity & Environmental Intelligence RAG System

An AI-powered environmental reasoning engine built for the **Darukaa.Earth AI Biodiversity Intelligence Chatbot Challenge**.

Unlike generic LLM chatbots, this system behaves as an **AI Environmental Scientist**. It connects **Soil Health, Water Availability, Land Cover, Climate Factors, and Human Impacts** to generate actionable, non-obvious recommendations supported by scientific reasoning, quantifiable metrics, and references (FAO, IPCC, COP16 IETA, UN CBD).

---

## 🌟 Core Features

- **Multi-Variable Reasoning Engine**: Simultaneously analyzes Soil Organic Carbon (SOC %), rainfall, crop/land cover type, regional microclimates, and species richness.
- **Dual-Mode RAG Architecture**:
  1. **Vertex AI Search & Discovery Engine**: Connects to Google Cloud Storage indexed environmental PDF reports.
  2. **Grounded Scientific Knowledge Base**: Built-in RAG dataset parsed from FAO, IPCC, COP16 IETA, and semi-arid land management studies.
- **Evidence-Backed Recommendations**: Every response provides:
  - 🌿 Actionable Recommendation
  - 🔬 Bio-geochemical Reasoning (e.g., mycorrhizal fungi, nitrogen fixation, soil percolation)
  - 📈 Impacted Metrics (% measurable change over time)
  - ⏱️ Implementation Horizon & Confidence Score (%)
  - 📚 Scientific Grounding & Literature Citations
  - ❓ Recommended Clarifications (for incomplete user parameters)
- **Flexible Inputs**: Text chat interface + structured environmental parameter controls (SOC %, Rainfall, Land use, Geo-coordinates).

---

## 🏗️ Architecture Overview

```
+-------------------------------------------------------------------------+
|                        Next.js 15 Frontend                              |
|   (Interactive Chat Interface + Structured Parameter Drawer + Presets)  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                      Next.js API Route (/api/chat)                      |
+-------------------------------------------------------------------------+
                                    |
       +----------------------------+----------------------------+
       |                                                         |
       v                                                         v
+-----------------------------+                           +-----------------------------+
| GCP Vertex AI Search        |                           | Grounded Scientific         |
| (Discovery Engine API)      |                           | Knowledge Base (RAG)        |
| *Indexed PDF Reports        |                           | *FAO, IPCC, COP16, CBD      |
+-----------------------------+                           +-----------------------------+
       \                                                         /
        \                                                       /
         v                                                     v
+-------------------------------------------------------------------------+
|                        Google Gemini 2.0 Flash                          |
|         (Scientific Reasoning, Synthesis & Follow-up Inquiries)         |
+-------------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Turbopack, React 18, TypeScript)
- **AI & RAG Engine**: `@google/genai` (Gemini 2.0 Flash), `@google-cloud/vertexai` (Discovery Engine)
- **UI Components**: TailwindCSS, Radix UI primitives, Lucide React icons, Framer/Animate
- **Deployment**: Vercel / Render / Google Cloud Run / Railway / Netlify

---

## 🚀 Environment Variables & Configuration

Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
# Required for Gemini 2.0 Flash Reasoning & RAG Synthesis
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Google Cloud Vertex AI Search / Discovery Engine
GCP_PROJECT_ID=194113201958
GCP_LOCATION=eu
GCP_COLLECTION_ID=default_collection
GCP_ENGINE_ID=darukaa-knowledge-hub-app_1747299091695
GCP_SERVING_CONFIG_ID=default_search
```

> **Note**: The system is designed with a **fail-safe hybrid RAG architecture**. If GCP credentials are not present, it automatically uses the built-in grounded scientific knowledge base with `GEMINI_API_KEY`, allowing zero-friction deployment on Vercel or Render.

---

## 💻 Local Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/darukaa-bio-knowledge-rag.git
cd darukaa-bio-knowledge-rag

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🌐 Hosting & Deployment Options

### Option 1: Vercel (Recommended — 2-Minute Deployment)
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/).
3. Add `GEMINI_API_KEY` under **Environment Variables**.
4. Click **Deploy**.

### Option 2: Render / Railway / Netlify
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment Variables: `GEMINI_API_KEY=your_key`

### Option 3: Docker / Google Cloud Run
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📋 Files Included for GitHub Submission

```
darukaa-bio-knowledge-rag/
├── files/                              # Curated PDF Research Reports
│   ├── forest_management_in_semi_arid_india.pdf
│   ├── From_Carbon_to_Nature_2023_White_paper.pdf
│   ├── IETA_Report_COP16-Biodiversity-Report.V3.pdf
│   ├── NAP final-2023.pdf
│   └── TheFutureOfBiodiversityCreditMarkets.pdf
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts           # Chat API Endpoint (Multi-variable RAG)
│   │   ├── page.tsx                    # Main Web Interface
│   │   ├── layout.tsx                  # Global App Layout
│   │   └── globals.css                 # Styling
│   ├── components/
│   │   ├── chat/chat-interface.tsx     # Interactive UI with Structured Parameters
│   │   ├── layout/header.tsx
│   │   └── layout/footer.tsx
│   ├── lib/
│   │   ├── gemini-client.ts            # Gemini 2.0 Flash Reasoning SDK
│   │   ├── discoveryEngine.ts          # GCP Vertex AI Search Integration
│   │   └── knowledgeBase.ts            # Grounded Scientific RAG Dataset
│   └── types/
│       └── chat.ts                     # TypeScript Interfaces
├── .env.example                        # Environment Variables Template
├── .gitignore                          # Configured to ignore secrets & build outputs
├── package.json                        # Dependencies & Scripts
├── next.config.ts                      # Next.js Config
├── tsconfig.json                       # TypeScript Config
└── README.md                           # Documentation
```

---

## 📝 Submission Checklist (.docx Submission)

When submitting through the Darukaa.Earth job portal, ensure your Word document includes:
1. **GitHub Repository Link**: (Public or private with granted access to `ankita.dasgupta@darukaa.earth`, `harsh.kumar@darukaa.earth`, `utkarsh.gauniyal@darukaa.earth`, `guneet.mutreja@darukaa.earth`)
2. **Live Demo URL**: (e.g. `https://darukaa-biodiversity-rag.vercel.app`)
3. **README.md Overview**: Architecture, database/schema, local setup, CI/CD details.
4. **Credentials & Instructions**: Notes on setting `GEMINI_API_KEY`.
>>>>>>> 104fae2 (Initial commit: Darukaa Bio Knowledge RAG system with TypeScript fixes)
