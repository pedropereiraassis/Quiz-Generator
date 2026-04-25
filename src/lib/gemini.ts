import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy and descriptive title for the quiz.",
    },
    description: {
      type: Type.STRING,
      description: "A short description of what the quiz covers.",
    },
    questions: {
      type: Type.ARRAY,
      description: "A list of 5 to 8 multiple choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The question text.",
          },
          options: {
            type: Type.ARRAY,
            description: "Exactly 4 options for the multiple choice question.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique short id, e.g. 'a', 'b', 'c', 'd'" },
                text: { type: Type.STRING, description: "The answer option text" },
              },
              required: ["id", "text"]
            },
          },
          correctOptionIds: {
            type: Type.ARRAY,
            description: "An array of the correct option ids. Usually 1 correct answer, but can be more than 1.",
            items: { type: Type.STRING }
          },
          explanation: {
            type: Type.STRING,
            description: "An explanation of why the correct answers are correct, and why others might be wrong."
          }
        },
        required: ["text", "options", "correctOptionIds", "explanation"]
      }
    }
  },
  required: ["title", "description", "questions"]
};

export async function generateQuiz(topic: string): Promise<Omit<Quiz, 'id' | 'createdAt'>> {
  const prompt = `Generate a quiz about the topic: "${topic}".
The quiz must contain between 5 and 8 questions.
The questions should be multiple choice, with exactly 4 options.
Some questions might have exactly one correct answer, and others might have multiple correct answers.
Make the questions interesting, challenging, but fair.
Use the googleSearch tool if you need to gather recent or accurate information about the topic.`;

  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: quizSchema,
      systemInstruction: "You are an expert quiz creator. Write engaging and factually correct quizzes."
    }
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Failed to generate quiz content.");
  }

  const generatedData = JSON.parse(text);
  
  return {
    title: generatedData.title,
    description: generatedData.description,
    topic,
    questions: generatedData.questions.map((q: any) => ({
      id: Math.random().toString(36).substring(7),
      text: q.text,
      options: q.options,
      correctOptionIds: q.correctOptionIds,
      explanation: q.explanation
    }))
  };
}
