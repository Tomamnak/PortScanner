import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PortProfile } from "../types";

// Initialize Gemini Client
// The API key is guaranteed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    summary: { type: Type.STRING, description: "A brief executive summary of the target's likely security posture." },
    ports: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          port: { type: Type.INTEGER },
          protocol: { type: Type.STRING, enum: ["TCP", "UDP"] },
          service: { type: Type.STRING },
          state: { type: Type.STRING, enum: ["Open", "Filtered", "Closed"] },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          description: { type: Type.STRING },
          vulnerabilities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "CVE ID (e.g., CVE-2023-1234) or generic issue name" },
                description: { type: Type.STRING, description: "Short description of the vulnerability" },
                severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] }
              },
              required: ["id", "description", "severity"]
            },
            description: "List of potential vulnerabilities associated with this service/port."
          }
        },
        required: ["port", "protocol", "service", "state", "riskLevel", "description"]
      }
    }
  },
  required: ["target", "summary", "ports"]
};

export const profileTarget = async (target: string): Promise<{ ports: PortProfile[], summary: string }> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Act as a Senior Network Security Engineer and Pentester.
      I need you to generate a *simulated* port scan and vulnerability profile for the following target: "${target}".
      
      Since we cannot physically scan the target right now, use your knowledge base to predict:
      1. What services this type of target usually runs.
      2. Which ports are likely to be OPEN.
      3. What the potential security risks are for those ports.
      
      If the target is a generic service name (e.g., "PostgreSQL Database"), profile the standard ports for that service.
      If the target is a domain (e.g., "example.com"), profile a standard web server configuration for that domain type.
      
      CRITICAL: For each open port, list 1-3 *potential* vulnerabilities that are historically common for that service type. 
      Use realistic CVE IDs (e.g., CVE-2021-44228 for Java apps, or generic IDs like "WEAK-AUTH") and descriptions.
      
      Be realistic. Include a mix of standard ports (80, 443) and management ports if applicable (22, 3389, 8080).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scanResultSchema,
        systemInstruction: "You are a realistic network simulation engine. Output raw JSON."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      ports: data.ports,
      summary: data.summary
    };

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw new Error("Failed to generate port profile.");
  }
};

export const analyzeLog = async (logData: string): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Analyze the following raw Nmap (or similar) scan output.
      Provide a detailed security report in Markdown format.
      Include:
      1. Executive Summary
      2. Open Port Analysis
      3. OS Detection (if applicable)
      4. Critical Vulnerabilities
      5. Recommended Remediation Steps
      
      Raw Log:
      ${logData.substring(0, 10000)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze logs.");
  }
};