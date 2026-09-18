"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Message, EnvironmentalMetricsInput } from '@/types/chat';
import { User, Bot, Send, Loader2, SlidersHorizontal, Sparkles, Sprout, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `### 👋 Welcome to Darukaa.Earth AI Environmental Intelligence System

I am your **AI Environmental Scientist**. I specialize in multi-metric ecological reasoning—connecting **soil health, rainfall patterns, land use, and biodiversity indicators** to generate scientifically grounded recommendations supported by FAO, IPCC, and COP16 research.

*Try selecting an environmental scenario below or enter your land metrics to begin!*`,
      timestamp: new Date(),
      relatedQuestions: [
        "Biodiversity is declining on my land (SOC: 0.3%, Rainfall: low, Crop: monoculture wheat, Region: semi-arid)",
        "How can I increase soil carbon and earn biodiversity credits?",
        "What are the best cover crops for semi-arid drought resilience?"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(false);
  
  // Structured input parameters state
  const [metrics, setMetrics] = useState<EnvironmentalMetricsInput>({
    soc: '0.3%',
    rainfall: 'Low',
    landUse: 'Monoculture wheat',
    region: 'Semi-arid',
    coordinates: '19.0760° N, 72.8777° E'
  });

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    await submitMessage(inputValue, showMetricsPanel ? metrics : undefined);
  };

  const submitMessage = async (queryText: string, customMetrics?: EnvironmentalMetricsInput) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: queryText,
      sender: 'user',
      timestamp: new Date(),
      structuredParams: customMetrics,
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.text,
          structuredInput: customMetrics,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.answer || {};

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: botResponse.answerText || "Sorry, I could not generate a response.",
        sender: 'bot',
        timestamp: new Date(),
        relatedQuestions: botResponse.relatedQuestions || [],
      };

      setMessages((prev: Message[]) => [...prev, botMessage]);
      setSuggestions(botResponse.relatedQuestions || []);
    } catch (error) {
      console.error('Chat API Error:', error);
      toast({
        title: "Communication Error",
        description: (error as Error).message || "Failed to reach AI service.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (scenarioText: string) => {
    submitMessage(scenarioText, metrics);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl border border-emerald-500/20 bg-card overflow-hidden">
      {/* Header */}
      <CardHeader className="border-b bg-muted/30 py-4 px-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <Sprout className="h-6 w-6 text-emerald-600" />
            Darukaa.Earth Intelligence Hub
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Multi-Metric RAG System & Scientific Decision Engine
          </CardDescription>
        </div>
        <Button
          variant={showMetricsPanel ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMetricsPanel(!showMetricsPanel)}
          className="text-xs gap-1 border-emerald-500/40"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {showMetricsPanel ? "Hide Parameters" : "Environmental Parameters"}
          {showMetricsPanel ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </CardHeader>

      {/* Structured Parameters Panel */}
      {showMetricsPanel && (
        <div className="bg-emerald-950/5 dark:bg-emerald-950/20 border-b p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Structured Environmental Context (Optional)
            </span>
            <Badge variant="secondary" className="text-[10px]">Multi-Variable RAG Active</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Soil Organic Carbon %</label>
              <Input
                value={metrics.soc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, soc: e.target.value })}
                placeholder="e.g. 0.3%"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Rainfall Pattern</label>
              <Input
                value={metrics.rainfall}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, rainfall: e.target.value })}
                placeholder="e.g. Low (450mm)"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Land / Crop Type</label>
              <Input
                value={metrics.landUse}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, landUse: e.target.value })}
                placeholder="e.g. Wheat Monoculture"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Geographical Region</label>
              <Input
                value={metrics.region}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, region: e.target.value })}
                placeholder="e.g. Semi-arid"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Geo-Coordinates</label>
              <Input
                value={metrics.coordinates}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, coordinates: e.target.value })}
                placeholder="19.0760 N, 72.8777 E"
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll View */}
      <CardContent className="p-0">
        <ScrollArea className="h-[55vh] p-4 md:p-6">
          <div className="space-y-6">
            {messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <Avatar className="h-9 w-9 border border-emerald-500/40 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    <AvatarFallback><Bot className="h-5 w-5 text-emerald-600" /></AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[85%] md:max-w-[78%] p-4 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-muted/70 text-foreground border border-emerald-500/10 rounded-bl-none'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.text}
                  </div>

                  {/* If user message included structured parameters, display badge */}
                  {msg.structuredParams && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1 text-[10px]">
                      <span className="opacity-80">Params:</span>
                      <Badge variant="outline" className="text-[10px] text-white border-white/40">SOC: {msg.structuredParams.soc}</Badge>
                      <Badge variant="outline" className="text-[10px] text-white border-white/40">Rainfall: {msg.structuredParams.rainfall}</Badge>
                      <Badge variant="outline" className="text-[10px] text-white border-white/40">Land: {msg.structuredParams.landUse}</Badge>
                    </div>
                  )}

                  <p
                    className={`text-[10px] mt-2 ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-muted-foreground text-left'
                    }`}
                  >
                    {format(msg.timestamp, 'p')}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <Avatar className="h-9 w-9 border border-primary bg-emerald-600 text-white">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                <Avatar className="h-9 w-9 border border-emerald-500/40 bg-emerald-100 text-emerald-800">
                  <AvatarFallback><Bot className="h-5 w-5 text-emerald-600 animate-pulse" /></AvatarFallback>
                </Avatar>
                <div className="p-4 rounded-2xl bg-muted/70 text-foreground rounded-bl-none border border-emerald-500/10">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <p className="text-xs font-medium text-muted-foreground">Analysing multi-variable environmental RAG data...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Related / Follow-up Questions Suggestions */}
          {suggestions && suggestions.length > 0 && !isLoading && (
            <div className="mt-6 pt-4 border-t space-y-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Follow-up Scientific Inquiries:
              </span>
              <div className="flex flex-col gap-1.5">
                {suggestions.map((q: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(q)}
                    className="text-left text-xs bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-500/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Input Form */}
      <CardFooter className="p-4 border-t bg-muted/20">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about soil health, biodiversity credits, rainfall, or restoration..."
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-sm bg-background border-emerald-500/30 focus-visible:ring-emerald-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
