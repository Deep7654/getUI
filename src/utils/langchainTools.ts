// src/utils/langchainTools.ts
import { Sandbox } from "@e2b/code-interpreter";
import { DynamicTool } from "langchain/tools";

export function makeLangchainTools(sandbox: Sandbox) {
  return [
    new DynamicTool({
      name: "read_file",
      description: "Read a file from the sandbox",
      func: async (path: string) => ({
        data: await sandbox.files.read(path),
      }),
    }),
    new DynamicTool({
      name: "write_file",
      description: "Write content to a sandbox file; input: path\\n---\\ncontent",
      func: async (input: string) => {
        const [path, ...rest] = input.split("\n---\n");
        const content = rest.join("\n---\n");
        await sandbox.files.write(path.trim(), content);
        return { data: `Written file ${path}` };
      },
    }),
    new DynamicTool({
      name: "run_command",
      description: "Run a shell command; input is the full command",
      func: async (cmd: string) => {
        const result = await sandbox.commands.run(cmd);
        return { data: result.stdout || result.stderr };
      },
    }),
  ];
}
