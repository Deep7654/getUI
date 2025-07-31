import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "getUI" });

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// export const gemini = new ChatGoogleGenerativeAI({
//   model: "models/gemini-1.5-pro-latest",
//   temperature: 0.3,
//   apiKey: process.env.GOOGLE_API_KEY!,
// });
