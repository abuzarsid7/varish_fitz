import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key") {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const getFitnessChatReply = async ({ question, profile }) => {
  const client = getGeminiClient();
  if (!client) {
    return "AI provider is not configured. Add GEMINI_API_KEY in server/.env to enable chatbot responses.";
  }

  const systemInstruction =
    "You are a virtual gym trainer assistant. Answer only about fitness, posture, workouts, nutrition, hydration, and recovery. Keep replies concise and practical.";

  const profileContext = `User profile: age=${profile?.age}, heightCm=${profile?.heightCm}, weightKg=${profile?.weightKg}, gender=${profile?.gender}, goal=${profile?.fitnessGoal}, level=${profile?.experienceLevel}`;

  try {
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      systemInstruction,
      generationConfig: {
        temperature: 0.4
      }
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${profileContext}\nQuestion: ${question}` }] }]
    });

    return result.response?.text() || "No response generated.";
  } catch (error) {
    console.error("Gemini chat error:", error.message);
    return "AI assistant encountered an error. Please verify your GEMINI_API_KEY in server/.env or try again.";
  }
};

