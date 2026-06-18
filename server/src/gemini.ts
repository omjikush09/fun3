import { GoogleGenAI, type Content, type Part } from "@google/genai";
import {
  ListProjectFileDeclaration,
  ReadFileDeclaration,
  readProjectFile,
  WriteFileDeclaration,
  writeProjectFile,
} from "./tools.js";
import { listProjectFiles } from "./projectFiles.js";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
const maxToolSteps = 5;

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!apiKey) {
    return "Mock mode: GEMINI_API_KEY is not configured, so no files were changed.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents: Content[] = [{ role: "user", parts: [{ text: prompt }] }];

  for (let step = 0; step < maxToolSteps; step += 1) {
    const result = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        tools: [
          { functionDeclarations: [ReadFileDeclaration, WriteFileDeclaration, ListProjectFileDeclaration] },
        ],
      },
    });

    if (!result.functionCalls?.length) {
      return result.text ?? "Done.";
    }

    if (result.candidates?.[0]?.content) {
      contents.push(result.candidates[0].content);
    }

    const toolResponses: Part[] = [];
    let didWrite = false;

    for (const call of result.functionCalls) {
      if (!call.name) continue;
      if (call.name === "write") didWrite = true;

      toolResponses.push({
        functionResponse: {
          id: call.id,
          name: call.name,
          response: { output: await runTool(call.name, call.args ?? {}) },
        },
      });
    }

    contents.push({ role: "user", parts: toolResponses });

    if (didWrite) {
      return "Updated the project files.";
    }
  }

  return "Stopped after too many tool calls. Please try a more specific request.";
}

async function runTool(name: string, args: unknown) {
  switch (name) {
    case "write":
      await writeProjectFile(args as { path: string; content: string });
      return "written";
    case "read":
      return readProjectFile(args as { path: string });
    case "list": {
      const files = await listProjectFiles();
      return files.map((file) => file.path);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
