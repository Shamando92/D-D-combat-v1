
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface MonsterStats {
  name: string;
  hp: number;
  ac: number;
  str: number;
  dex: number;
  cos: number;
  int: number;
  wis: number;
  cha: number;
  attack?: string;
  attackDamage?: string;
  reaction?: string;
  bonusAction?: string;
}

export const fetchMonsterStats = async (monsterName: string): Promise<MonsterStats | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for D&D 5e stats for the creature: "${monsterName}". Return the basic combat stats.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hp: { type: Type.INTEGER },
            ac: { type: Type.INTEGER },
            str: { type: Type.INTEGER },
            dex: { type: Type.INTEGER },
            cos: { type: Type.INTEGER },
            int: { type: Type.INTEGER },
            wis: { type: Type.INTEGER },
            cha: { type: Type.INTEGER },
            attack: { type: Type.STRING },
            attackDamage: { type: Type.STRING },
            reaction: { type: Type.STRING },
            bonusAction: { type: Type.STRING },
          },
          required: ["name", "hp", "ac", "str", "dex", "cos", "int", "wis", "cha"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch monster stats:", error);
    return null;
  }
};
