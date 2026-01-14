
import { GoogleGenAI, Type } from "@google/genai";
import { WordAnalysis, EvaluationResult, GrammarQnAResult } from "./types";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCenk49HrGk0Qu0qEMlJj-w9-SaB2Eo-Cc"
});

export const analyzeWord = async (word: string): Promise<WordAnalysis> => {
  const prompt = `জাপানি শব্দ বিশ্লেষণ: "${word}"।
  
  JSON আউটপুট দিন (বাংলায়):
  ১. অর্থ ও কাঞ্জি।
  ২. গ্রামার: "Causative (খাইয়ে দেওয়া)" সহ সকল রূপ।
  ৩. টেবিল: অবশ্যই "Causative" রূপটি অন্তর্ভুক্ত করবেন। অন্যান্য রূপ: Dictionary, Polite, Negative, Te-form, Potential, Passive, Conditional।
  ৪. ১০ থেকে ১৫টি সহজ উদাহরণ বাক্য (Japanese, Romaji, Bengali)।
  ৫. Politeness এবং টিপস।`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          reading: { type: Type.STRING },
          wordType: { type: Type.STRING },
          meanings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                meaning: { type: Type.STRING },
                context: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["meaning", "context", "explanation"],
            },
          },
          grammarBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                form: { type: Type.STRING },
                explanation: { type: Type.STRING },
                exampleVariation: { type: Type.STRING },
                usageRule: { type: Type.STRING },
              },
              required: ["form", "explanation", "exampleVariation"],
            },
          },
          conjugationTable: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                formName: { type: Type.STRING },
                japanese: { type: Type.STRING },
                romaji: { type: Type.STRING },
                meaningInBengali: { type: Type.STRING },
              },
              required: ["formName", "japanese", "romaji", "meaningInBengali"],
            },
          },
          homonyms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                kanji: { type: Type.STRING },
                meaning: { type: Type.STRING },
                differenceExplanation: { type: Type.STRING },
              },
              required: ["kanji", "meaning"],
            },
          },
          examples: {
            type: Type.ARRAY,
            minItems: 10,
            maxItems: 15,
            items: {
              type: Type.OBJECT,
              properties: {
                japanese: { type: Type.STRING },
                romaji: { type: Type.STRING },
                bengali: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["japanese", "romaji", "bengali"],
            },
          },
          additionalNotes: {
            type: Type.OBJECT,
            properties: {
              politeness: { type: Type.STRING },
              mistakes: { type: Type.STRING },
              spokenShortcuts: { type: Type.STRING },
              cultural: { type: Type.STRING },
            },
            required: ["politeness", "mistakes", "cultural"],
          },
        },
        required: ["word", "reading", "meanings", "grammarBreakdown", "conjugationTable", "examples", "additionalNotes"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const evaluateSentence = async (bengaliIntent: string, japaneseAttempt: string): Promise<EvaluationResult> => {
  const prompt = `বাক্য মূল্যায়ন:
  Bengali: "${bengaliIntent}"
  Japanese Attempt: "${japaneseAttempt}"
  
  JSON-এ দ্রুত উত্তর দিন (বাংলায় ব্যাখ্যা সহ)।`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          statusMessage: { type: Type.STRING },
          detailedExplanation: { type: Type.STRING },
          naturalJapanese: { type: Type.STRING },
          romaji: { type: Type.STRING },
          bengaliMeaning: { type: Type.STRING },
          corrections: {
            type: Type.OBJECT,
            properties: {
              casual: { type: Type.STRING },
              polite: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["casual", "polite", "explanation"],
          },
          commonMistakesInThisContext: { type: Type.STRING },
        },
        required: ["isCorrect", "statusMessage", "detailedExplanation", "naturalJapanese", "romaji", "bengaliMeaning", "corrections"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const askGrammarQuestion = async (question: string): Promise<GrammarQnAResult> => {
  const prompt = `আপনি একজন বিশেষজ্ঞ জাপানি গ্রামার টিউটর। ইউজারের প্রশ্ন: "${question}"।
  
  নিম্নলিখিত কাঠামোতে উত্তর দিন (JSON ফরম্যাটে):
  ১. সহজ ভাষায় মূল গ্রামারটির ব্যাখ্যা।
  ২. পয়েন্ট আকারে গ্রামারের নিয়মাবলী (Rules)।
  ৩. এই গ্রামার ব্যবহার করে ৫ থেকে ৬ লাইনের একটি কথোপকথন (Conversation)।
  ৪. ১৫ থেকে ২০টি ভিন্ন ভিন্ন উদাহরণ বাক্য (Japanese, Romaji, Bengali translation, explanation)।
  
  সম্পূর্ণ উত্তর বাংলায় হতে হবে।`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          rules: { type: Type.ARRAY, items: { type: Type.STRING } },
          conversation: {
            type: Type.ARRAY,
            minItems: 5,
            maxItems: 6,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING },
                text: { type: Type.STRING },
                romaji: { type: Type.STRING },
                translation: { type: Type.STRING },
              },
              required: ["speaker", "text", "romaji", "translation"],
            },
          },
          examples: {
            type: Type.ARRAY,
            minItems: 15,
            maxItems: 20,
            items: {
              type: Type.OBJECT,
              properties: {
                japanese: { type: Type.STRING },
                romaji: { type: Type.STRING },
                bengali: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["japanese", "romaji", "bengali", "explanation"],
            },
          },
        },
        required: ["topic", "explanation", "rules", "conversation", "examples"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
