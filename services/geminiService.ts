import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAIResponse = async (
  prompt: string,
  systemInstruction: string = "You are a helpful assistant for a LINE Official Account."
): Promise<string> => {
  try {
    if (!apiKey || !ai) {
      return "กรุณาตั้งค่า VITE_GEMINI_API_KEY ในไฟล์ .env.local ก่อนใช้งาน AI";
    }

    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};
