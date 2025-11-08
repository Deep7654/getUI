import { inngest } from "../client";
import { runGeminiAgent } from "./gemini-agent";

export const helloWorld = inngest.createFunction(
  { id: "hello-world-gemini" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const result = await runGeminiAgent(event.data.email);
    return result;
  }
);
