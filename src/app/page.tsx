import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Database, LineChart, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background dark:from-emerald-950/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center max-w-6xl">
        <section className="w-full max-w-3xl text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Sprout className="h-3.5 w-3.5 text-emerald-600" /> Darukaa.Earth AI Hackathon Submission
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-100 sm:text-5xl">
            AI Biodiversity & Ecological Reasoning Engine
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            An intelligent RAG system that connects <strong>soil health, water availability, land cover, and climate factors</strong> to generate scientifically backed recommendations with quantifiable estimates.
          </p>
        </section>

        {/* Core RAG Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
          <Card className="border border-emerald-500/20 bg-card/60 backdrop-blur">
            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-sm font-semibold">Curated RAG Layer</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Retrieves evidence from indexed COP16, FAO, IPCC, and Biodiversity Credit market datasets.
            </CardContent>
          </Card>

          <Card className="border border-emerald-500/20 bg-card/60 backdrop-blur">
            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-sm font-semibold">Multi-Variable Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Evaluates Soil Organic Carbon (SOC %), rainfall, land cover, and species richness simultaneously.
            </CardContent>
          </Card>

          <Card className="border border-emerald-500/20 bg-card/60 backdrop-blur">
            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-sm font-semibold">Scientific Grounding</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Every recommendation includes bio-geochemical reasoning, time horizons, and confidence scores.
            </CardContent>
          </Card>
        </section>

        {/* Interactive Chat */}
        <section className="w-full">
          <ChatInterface />
        </section>
      </main>
      <Footer />
    </div>
  );
}
