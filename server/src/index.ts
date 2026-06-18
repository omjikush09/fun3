import "dotenv/config";
import cors from "cors";
import express from "express";
import { listProjectFiles } from "./projectFiles.js";
import type { Message, ProjectSnapshot } from "./types.js";
import { generateWithGemini } from "./gemini.js";

const app = express();
const port = Number(process.env.PORT ?? 8787);
const previewUrl = process.env.PROJECT_PREVIEW_URL ?? "http://localhost:5174";
const messageHistory: Message[] = [];

const systemPrompt = `Update the React app in project/.
Only edit listed files.
Use tools when needed, then stop and reply with a short summary.`;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/project", async (_request, response) => {
  return response.json(await createSnapShot());
});

app.post("/api/messages", async (request, response) => {
  const message = typeof request.body.message === "string" ? request.body.message.trim() : "";
  if (!message) {
    return response.status(400).json({ error: "Message is required." });
  }

  try {
    const mes: Message = {
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };
    messageHistory.push(mes);
    const res = await generateWithGemini(await createGeminiPrompt());
    const assist: Message = {
      role: "assistant",
      content: res,
      createdAt: new Date().toISOString(),
    };
    messageHistory.push(assist);
    return response.json(await createSnapShot());
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Request failed.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


async function createSnapShot(): Promise<ProjectSnapshot> {
  return {
    summary: "",
    messageHistory: messageHistory,
    files: await listProjectFiles(),
    updatedAt: new Date().toISOString(),
    previewUrl: previewUrl,
  };
}

async function createGeminiPrompt() {
  const files = await listProjectFiles();
  const projectContext = files
    .map((file) => `--- ${file.path} ---\n${file.content}`)
    .join("\n\n");

  return `${systemPrompt}

Messages:
${JSON.stringify(messageHistory, null, 2)}

Files:
${projectContext}

Make the requested change.`;
}
