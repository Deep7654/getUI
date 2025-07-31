import {Sandbox} from "@e2b/code-interpreter";
import { AgentResult, TextMessage} from "@inngest/agent-kit";

export async function getSandbox(sandboxId : string) {
    const sandbox = await Sandbox.connect(sandboxId)
    return sandbox;
}

export function lastAssistantTextMessageContent(result : AgentResult){
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );

    const message = result.output[lastAssistantTextMessageIndex] as   TextMessage
    | undefined;

     if (!message || !message.content) return undefined;

  if (typeof message.content === "string") {
    return message.content;
  }

  // message.content is array of { text: string }
  return message.content.map((c) => c.text).join("");

    // return message?.content
    // ?  typeof message.content === "string"
    // ? message.content
    // : message.content.map((c)=>c.text).join("")
    // :undefined ;
}


// import { Sandbox } from "@e2b/code-interpreter";

// export async function getSandbox(sandboxId: string) {
//   return await Sandbox.connect(sandboxId);
// }
