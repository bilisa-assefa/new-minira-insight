import { GoogleGenAI } from "@google/genai";

function generateSimulatedSingleNodeResult(lat: any, lng: any, rockType: any, targetMineral: any, elevation: any, ndvi: any, faultPresence: any) {
    let conf = 50 + (Math.abs(Number(lat) * Number(lng) * 100) % 40);
    const r = String(rockType).toLowerCase();
    if (r.includes('volcanic') || r.includes('precambrian') || r.includes('schist')) conf += 15;
    if (faultPresence) conf += 10;
    conf = Math.min(99, Math.floor(conf));
    
    return {
        potential: conf >= 75 ? "High Potential" : (conf >= 55 ? "Medium Potential" : "Low Potential"),
        mineral: targetMineral === 'Auto-Detect' ? 'General Minerals' : targetMineral,
        confidence: conf,
        ndvi: Number(ndvi) || 0.4,
        elevation: Number(elevation) || 1500,
        rock_type: rockType || 'Unknown',
        explanations: [
            "Simulated local terrain analysis (API Fallback).",
            "Geological structures are present.",
            `Primary region unit: ${rockType}`
        ]
    };
}

function generateSimulatedMultiNodeResult(features: any[], searchMineral: any) {
    const results = features.map((f: any, idx: number) => {
        let conf = 40 + (Math.abs(Number(f.lat) * Number(f.lng) * 100) % 50);
        return {
            id: f.id || String(idx),
            mineral: searchMineral,
            lat: Number(f.lat) || 0,
            lng: Number(f.lng) || 0,
            confidence: Math.floor(Math.min(99, conf)),
            rock_type: f.rock_type || 'Unknown',
            distanceInfo: "AI API Fallback - Estimate",
            description: "Geological formations indicate potential matches. (Simulated result due to API limits/keys)"
        };
    });
    return { results };
}

async function fetchAIResponse(prompt: string) {
  // Try Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      console.warn("Gemini API failed or quota exceeded, attempting fallback to Qwen.", e.message);
      // Fall through to Qwen
    }
  }

  // Try Qwen fallback
  if (process.env.QWEN_API_KEY) {
    const apiKey = process.env.QWEN_API_KEY.trim();
    let endpoints = [
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      "https://dashscope-us.aliyuncs.com/compatible-mode/v1/chat/completions"
    ];
    
    if (apiKey.startsWith("sk-sp-")) {
      endpoints = [
        "https://coding.dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        "https://coding.dashscope.aliyuncs.com/api/v1/chat/completions",
        "https://coding.dashscope.aliyuncs.com/v1/chat/completions"
      ];
    }

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const fetchResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "qwen-plus",
            messages: [
              {
                role: "system",
                content: "You are an expert AI geologist. Only output valid JSON without any markdown formatting."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          })
        });
        
        const data = await fetchResponse.json();
        
        if (!fetchResponse.ok) {
          lastError = new Error(data.error?.message || data.message || "DashScope API error");
          // If it's an API key error, try the next region/endpoint
          if (lastError.message.toLowerCase().includes("api key") || lastError.message.toLowerCase().includes("api-key")) {
            continue;
          }
          // Otherwise, break and throw
          throw lastError;
        }
        
        const text = data.choices?.[0]?.message?.content || "{}";
        // Extract json from markdown if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        return JSON.parse(jsonString);
      } catch (fallbackErr: any) {
        lastError = fallbackErr;
      }
    }
    
    console.error("Qwen API Fallback Error:", lastError);
    throw new Error(`AI generation failed. Fallback error: ${lastError?.message || 'Unknown'}`);
  }

  throw new Error("No available AI providers. Provide GEMINI_API_KEY or QWEN_API_KEY.");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic security validation: Make sure body is an object to avoid crashes
  if (!req.body || typeof req.body !== 'object') {
     return res.status(400).json({ error: "Invalid request body" });
  }

  const { lat, lng, rockType, faultPresence, targetMineral, elevation, ndvi, multiple } = req.body;

  try {
    if (multiple) {
       // Multi-node prediction logic
       const { features, searchMineral } = req.body;
       
       if (!Array.isArray(features) || features.length > 50) {
          return res.status(400).json({ error: "Invalid or too many features provided. Maximum 50 allowed." });
       }

       const prompt = `You are an expert AI geologist analyzing potential mineral deposits in Ethiopia.
Target Mineral: ${String(searchMineral).substring(0, 50)}
Locations to analyze: ${JSON.stringify(features).substring(0, 15000)}

For each location, determine the likelihood of finding the target mineral based on the rock type and coordinates. Return a list of the MOST promising locations (up to 25).
Return ONLY valid JSON matching this schema:
{
  "results": [
    {
      "id": "number/string from input",
      "mineral": "string (the target mineral)",
      "lat": "number",
      "lng": "number",
      "confidence": "number (1-99)",
      "rock_type": "string",
      "distanceInfo": "string (distance to nearest major city)",
      "description": "string (1-2 sentences explaining why this is a good target)"
    }
  ]
}
Do not return any markdown wrapping. Just raw JSON.`;

       try {
           const parsed = await fetchAIResponse(prompt);
           return res.json({ results: parsed.results || [] });
       } catch (fallbackError) {
           console.warn("AI mapping fallback triggered:", fallbackError);
           return res.json(generateSimulatedMultiNodeResult(features, searchMineral));
       }
    }

    // Single node analysis logic
    const prompt = `You are an expert AI geologist. Evaluate this location for mineral deposits:
Coordinates: ${Number(lat)}, ${Number(lng)} (Ethiopia)
Rock Type: ${String(rockType).substring(0, 100)}
Elevation: ${Number(elevation)}m
NDVI (Vegetation): ${Number(ndvi)}
Fault Presence: ${Boolean(faultPresence)}
Target Mineral: ${targetMineral === 'Auto-Detect' ? 'Suggest the most likely mineral' : String(targetMineral).substring(0, 50)}

Calculate a score (1-100) and respond with JSON matching this schema:
{
    "potential": "High Potential | Medium Potential | Low Potential",
    "mineral": "string (the target or suggested mineral)",
    "confidence": "number (1-99)",
    "ndvi": "number (the ndvi)",
    "elevation": "number (the elevation)",
    "rock_type": "string (the rock type)",
    "explanations": ["string (bullet point reasons)"]
}`;

    try {
        const parsed = await fetchAIResponse(prompt);
        return res.json(parsed);
    } catch (fallbackError) {
        console.warn("AI node check fallback triggered:", fallbackError);
        return res.json(generateSimulatedSingleNodeResult(lat, lng, rockType, targetMineral, elevation, ndvi, faultPresence));
    }

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze location data", details: error.message });
  }
}
