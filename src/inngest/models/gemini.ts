import { AIAdapter } from "@inngest/agent-kit";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const GeminiAIAdapter = (modelName = "gemini-1.5-pro-latest"): AIAdapter => {
  const apiKey = process.env.GOOGLE_API_KEY;

  console.log("✅ [Gemini Adapter] GOOGLE_API_KEY is:", apiKey?.slice(0, 5), "...");
  if (!apiKey) {
    throw new Error("❌ GOOGLE_API_KEY is undefined! Please check your .env.local and dev server.");
  }

  const model = new ChatGoogleGenerativeAI({
    modelName,
    temperature: 0.3,
    apiKey, // if undefined, this will throw the .replace() error
  });

  return {
    async request(messages) {
      const response = await model.invoke(messages);
      return {
        content:
          typeof response === "string"
            ? response
            : response?.content ?? "No content returned",
      };
    },
  };
};
