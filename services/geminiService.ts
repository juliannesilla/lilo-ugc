import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageResolution } from "../types";

// Helper to ensure API key is present
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// --- Thinking Mode (Campaign Strategy) ---
export const generateCampaignStrategy = async (brandName: string, productType: string, goal: string) => {
  const ai = getAI();
  try {
    const prompt = `Act as a senior creative strategist for a UGC agency. 
    Develop a high-level campaign strategy for a brand named "${brandName}" selling "${productType}".
    The primary goal is: "${goal}".
    
    Provide:
    1. A hook/angle that stops the scroll.
    2. A visual concept description.
    3. Key messaging points.
    
    Keep it concise but deeply strategic.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep strategy
      }
    });
    return response.text;
  } catch (error) {
    console.error("Strategy generation failed:", error);
    throw error;
  }
};

// --- Search Grounding (Trend Spotter) ---
export const getTrendReport = async (niche: string) => {
  const ai = getAI();
  try {
    const prompt = `What are the top 3 trending content themes or viral hooks in the "${niche}" niche on TikTok and Instagram Reels right now? 
    Provide real-world context for each.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { text, grounding };
  } catch (error) {
    console.error("Trend report failed:", error);
    throw error;
  }
};

// --- Image Generation (Concept Viz) ---
export const generateConceptImage = async (prompt: string, resolution: ImageResolution, ar: AspectRatio) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: resolution,
          aspectRatio: ar
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

// --- Image Editing (Magic Editor) ---
export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    // Determine mime type from base64 header or default to png if raw
    let mimeType = 'image/png';
    let data = base64Image;
    if (base64Image.includes('data:')) {
      const matches = base64Image.match(/^data:(.*);base64,(.*)$/);
      if (matches) {
        mimeType = matches[1];
        data = matches[2];
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned");
  } catch (error) {
    console.error("Image editing failed:", error);
    throw error;
  }
};

// --- Image Analysis ---
export const analyzeImage = async (base64Image: string) => {
  const ai = getAI();
  try {
     let mimeType = 'image/png';
    let data = base64Image;
    if (base64Image.includes('data:')) {
      const matches = base64Image.match(/^data:(.*);base64,(.*)$/);
      if (matches) {
        mimeType = matches[1];
        data = matches[2];
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
           {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          { text: "Analyze this image. What are the key visual elements, mood, and potential marketing angles?" }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};

// --- Veo Video Generation ---
export const generateVideo = async (prompt: string, aspectRatio: string) => {
  // Re-initialize to ensure we pick up the key if selected via UI
  const ai = getAI(); 
  
  try {
    console.log("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9' 
      }
    });

    console.log("Video operation started, polling...", operation);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Polling status:", operation.metadata?.state);
    }

    if (operation.error) {
      throw new Error(String(operation.error.message || "Unknown error"));
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned");

    // Fetch the actual bytes
    const finalVideoUrl = `${videoUri}&key=${process.env.API_KEY}`;
    return finalVideoUrl;
    
  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};
