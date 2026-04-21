import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type AnalysisType = 'pros_cons' | 'comparison' | 'swot';

export interface AnalysisResult {
  title: string;
  summary: string;
  data: any;
}

export async function analyzeDecision(decision: string, type: AnalysisType): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";

  let systemInstruction = "";
  let responseSchema: any = {};

  if (type === 'pros_cons') {
    systemInstruction = "Analyze the given decision and provide a detailed list of pros and cons.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["pros", "cons"],
        },
      },
      required: ["title", "summary", "data"],
    };
  } else if (type === 'comparison') {
    systemInstruction = "Analyze the decision as a comparison between two or more options. Provide a comparison table structure.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            columns: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  values: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["feature", "values"],
              },
            },
          },
          required: ["columns", "rows"],
        },
      },
      required: ["title", "summary", "data"],
    };
  } else if (type === 'swot') {
    systemInstruction = "Perform a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for the given decision.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["strengths", "weaknesses", "opportunities", "threats"],
        },
      },
      required: ["title", "summary", "data"],
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this decision: "${decision}"`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("AI failed to generate a structured response. Please try again.");
  }
}
