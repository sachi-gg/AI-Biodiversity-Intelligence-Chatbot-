/**
 * Environmental & Biodiversity Scientific Knowledge Base (RAG Layer)
 * Curated from FAO, IPCC, COP16 IETA Reports, UN Convention on Biological Diversity (CBD),
 * and Semi-Arid Forest & Land Management Studies.
 */

export interface EnvironmentalKnowledgeDoc {
  id: string;
  title: string;
  category: 'soil_health' | 'land_use' | 'biodiversity' | 'climate' | 'human_impact' | 'credits_financing';
  source: string;
  keyMetrics: string[];
  findings: string;
  recommendations: Array<{
    action: string;
    scientificReasoning: string;
    impactedMetrics: string;
    timeHorizon: 'Short-term (1-2 yrs)' | 'Medium-term (3-5 yrs)' | 'Long-term (5-10 yrs)';
    confidenceScore: number;
    citation: string;
  }>;
}

export const SCIENTIFIC_KNOWLEDGE_BASE: EnvironmentalKnowledgeDoc[] = [
  {
    id: 'kb-soil-agroforestry',
    title: 'Soil Organic Carbon Enhancement via Legume Cover Crops & Agroforestry in Semi-Arid Zones',
    category: 'soil_health',
    source: 'FAO & Semi-Arid Land Management Studies (2023)',
    keyMetrics: ['Soil Organic Carbon (SOC)', 'Microbial biomass', 'Moisture retention', 'N2-fixation'],
    findings: 'Degraded semi-arid monoculture soils exhibit low SOC (<0.5%). Transitioning to legume-based cover cropping and agroforestry improves soil microbial activity, nitrogen fixation, and water infiltration.',
    recommendations: [
      {
        action: 'Implement legume-based cover crops (e.g., Cajanus cajan, Sesbania) and intercropping with leguminous trees',
        scientificReasoning: 'Symbiotic Rhizobium bacterial nitrogen fixation enriches active soil organic carbon pools, enhances hyphal network density of mycorrhizal fungi, and reduces evaporative water loss.',
        impactedMetrics: 'Increases Soil Organic Carbon by +15–25% over 2–3 years; increases water holding capacity by +12–18%',
        timeHorizon: 'Medium-term (3-5 yrs)',
        confidenceScore: 92,
        citation: 'FAO Soils Bulletin & Semi-Arid Forest Management Report (2023)'
      }
    ]
  },
  {
    id: 'kb-biodiversity-corridors',
    title: 'Habitat Heterogeneity & Biodiversity Credit Metric Standards',
    category: 'biodiversity',
    source: 'COP16 IETA Biodiversity Credit Report & CBD Framework (2024)',
    keyMetrics: ['Species Richness', 'Habitat Fragmentation Index', 'Pollinator Abundance', 'Bio-credits/ha'],
    findings: 'Habitat fragmentation drastically reduces species persistence. Establishing native plant buffer strips and wildlife corridors restores pollinator connectivity and earns high-tier biodiversity credits.',
    recommendations: [
      {
        action: 'Establish multi-strata native floral borders and micro-corridors along cropland edges',
        scientificReasoning: 'Provides continuous nectar reserves and nesting sites for wild apoidea and beneficial arthropods, mitigating edge effects and re-establishing genetic flow.',
        impactedMetrics: 'Boosts pollinator diversity by +35–40% and beneficial predator abundance by +28%',
        timeHorizon: 'Short-term (1-2 yrs)',
        confidenceScore: 94,
        citation: 'IETA COP16 Biodiversity Report & Climate Focus (2024)'
      }
    ]
  },
  {
    id: 'kb-water-climate-resilience',
    title: 'Rainwater Harvesting & Soil Moisture Regulation in Low-Rainfall Ecosystems',
    category: 'climate',
    source: 'IPCC Working Group II Report & National Adaptation Plan (NAP 2023)',
    keyMetrics: ['Soil moisture %', 'Rainfall runoff', 'Drought resilience index', 'Biomass density'],
    findings: 'In regions with low seasonal rainfall, unmanaged surface runoff causes severe topsoil loss. Contour bunding combined with deep-rooting native shrubs stabilizes topsoil and microclimates.',
    recommendations: [
      {
        action: 'Construct semi-circular bunds and plant drought-tolerant deep-rooted shrubs (e.g., Acacia, Vetiver grass)',
        scientificReasoning: 'Reduces surface runoff velocities, increases soil percolation rates, and maintains subsurface soil moisture during dry spells, preserving soil fauna.',
        impactedMetrics: 'Reduces topsoil erosion by ~60% and maintains root-zone soil moisture 20-30% longer during droughts',
        timeHorizon: 'Short-term (1-2 yrs)',
        confidenceScore: 89,
        citation: 'IPCC AR6 & National Adaptation Plan (NAP 2023)'
      }
    ]
  },
  {
    id: 'kb-landuse-restoration',
    title: 'Regenerative Land Use & Monoculture Diversification',
    category: 'land_use',
    source: 'Corporate Commitment to Nature & Biodiversity Credit Market Report (2024)',
    keyMetrics: ['Land Cover Diversity', 'Soil Carbon Sequestration', 'Pest Vulnerability Index'],
    findings: 'Continuous monoculture depletes soil trace minerals, accelerates pest vulnerability, and severely restricts avian and insect food webs.',
    recommendations: [
      {
        action: 'Transition from monoculture to integrated silvopastoral or agro-ecological polyculture',
        scientificReasoning: 'Diversified root architectures extract nutrients from varied soil depths while microclimatic shade reduces thermal stress on soil biota.',
        impactedMetrics: 'Increases ecosystem functional diversity score by +45% and soil carbon flux by +1.8 tCO2e/ha/yr',
        timeHorizon: 'Long-term (5-10 yrs)',
        confidenceScore: 90,
        citation: 'State of Biodiversity Credit Markets & Future of Nature Finance (2024)'
      }
    ]
  },
  {
    id: 'kb-human-impact-mitigation',
    title: 'Synthetic Input Reduction & Biological Pest Control Integration',
    category: 'human_impact',
    source: 'Harnessing Biodiversity Credits for People and Planet (2024)',
    keyMetrics: ['Ecotoxicity index', 'Soil earthworm density', 'Chemical runoff concentration'],
    findings: 'Over-application of synthetic pesticides and high-nitrogen fertilizers decimates soil fungal networks (mycorrhizae) and causes downstream aquatic eutrophication.',
    recommendations: [
      {
        action: 'Replace synthetic organophosphates with Integrated Pest Management (IPM) and bio-fertilizers',
        scientificReasoning: 'Protects soil earthworm (Lumbricidae) populations and preserves beneficial mycorrhizal fungi essential for plant nutrient uptake.',
        impactedMetrics: 'Restores subterranean macroinvertebrate biomass by +50% and reduces chemical leaching by ~80%',
        timeHorizon: 'Short-term (1-2 yrs)',
        confidenceScore: 95,
        citation: 'UN Report on Harnessing Biodiversity Credits (2024)'
      }
    ]
  }
];

/**
 * Retrieves relevant scientific grounding context based on user query keywords and environmental metrics.
 */
export function searchKnowledgeBase(query: string): { contextText: string; matchedDocs: EnvironmentalKnowledgeDoc[] } {
  const lowerQuery = query.toLowerCase();
  
  const matchedDocs = SCIENTIFIC_KNOWLEDGE_BASE.filter(doc => {
    const textToSearch = `${doc.title} ${doc.category} ${doc.findings} ${doc.keyMetrics.join(' ')} ${doc.recommendations.map(r => r.action + ' ' + r.scientificReasoning).join(' ')}`.toLowerCase();
    
    // Check keyword overlaps
    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
    const matches = keywords.filter(kw => textToSearch.includes(kw));
    
    return matches.length > 0 || 
      lowerQuery.includes('soil') || 
      lowerQuery.includes('carbon') || 
      lowerQuery.includes('biodiversity') || 
      lowerQuery.includes('rainfall') || 
      lowerQuery.includes('land') || 
      lowerQuery.includes('crop');
  });

  const docsToUse = matchedDocs.length > 0 ? matchedDocs : SCIENTIFIC_KNOWLEDGE_BASE;

  const contextText = docsToUse.map(doc => `
Document Title: ${doc.title}
Source: ${doc.source}
Key Metrics: ${doc.keyMetrics.join(', ')}
Findings: ${doc.findings}
Scientific Recommendations:
${doc.recommendations.map(r => `- Action: ${r.action}\n  Scientific Rationale: ${r.scientificReasoning}\n  Impacted Metrics: ${r.impactedMetrics}\n  Time Horizon: ${r.timeHorizon}\n  Confidence: ${r.confidenceScore}%\n  Citation: ${r.citation}`).join('\n')}
`).join('\n---\n');

  return { contextText, matchedDocs: docsToUse };
}
