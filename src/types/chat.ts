export interface EnvironmentalMetricsInput {
  soc?: string;          // Soil Organic Carbon % (e.g. 0.3%)
  rainfall?: string;     // Rainfall (e.g. Low / 450mm)
  landUse?: string;      // Crop / Land Use (e.g. Monoculture Wheat)
  region?: string;       // Region (e.g. Semi-arid India)
  coordinates?: string;  // Spatial / Geo-coordinates (e.g. 19.0760° N, 72.8777° E)
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  relatedQuestions?: string[];
  structuredParams?: EnvironmentalMetricsInput;
}
