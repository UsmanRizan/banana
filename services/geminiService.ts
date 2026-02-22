
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMatchCommentary(event: string, score: string): Promise<string> {
  const prompt = `You are a hype football commentator. Provide a one-sentence reaction to this event: "${event}". The current score is ${score}. Keep it excited and banana-themed if possible!`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "What a play!";
  } catch {
    return "Goal! Unbelievable scenes!";
  }
}
