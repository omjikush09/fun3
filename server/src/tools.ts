// put your tools here
import { Type } from "@google/genai"
import { mkdir, readFile, writeFile } from "fs/promises"
import nodePath from "path"
import { fileURLToPath } from "url"

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = nodePath.dirname(currentFile);
const projectRoot = nodePath.resolve(currentDirectory, "../../project");


export async function readProjectFile({path}:{path:string}):Promise<string> {
  const data = (await readFile(resolveProjectPath(path))).toString()
  return data
}

export async function writeProjectFile({path, content}:{path:string,content:string}) {

  const filePath = resolveProjectPath(path);
  await mkdir(nodePath.dirname(filePath), { recursive: true });
  await writeFile(filePath, content)

}

function resolveProjectPath(filePath: string) {
  if (!filePath || nodePath.isAbsolute(filePath)) {
    throw new Error("File path must be relative to project/.");
  }

  const resolvedPath = nodePath.resolve(projectRoot, filePath);
  const relativePath = nodePath.relative(projectRoot, resolvedPath);

  if (relativePath.startsWith("..") || nodePath.isAbsolute(relativePath)) {
    throw new Error("File path must stay inside project/.");
  }

  return resolvedPath;
}


export const ReadFileDeclaration = {
  name: "read",
  description: "Fuction to read file of given path",
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description:"Path of file"
      }
    },
    required: ["path"]
  }
}

export const WriteFileDeclaration = {
  name: "write",
  description: "Write to file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description:"Path of file"
      },
      content: {
        type: Type.STRING,
        description:"Content of file"
      }
    },
    required: ["path", "content"]
  }
}

export const ListProjectFileDeclaration = {
  name: "list",
  description: "List porject of all file",
  parameters: {
      type: Type.OBJECT,
      properties: {},
    },
}
