import { spawn } from "node:child_process";

const commands = [
  { name: "server", args: ["--workspace", "server", "run", "dev"] },
  { name: "client", args: ["--workspace", "client", "run", "dev"] },
  { name: "project", args: ["--workspace", "project", "run", "dev"] },
];

const children = [];
let isShuttingDown = false;

for (const command of commands) {
  const child = spawn("npm", command.args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  children.push(child);
  pipeOutput(child.stdout, command.name);
  pipeOutput(child.stderr, command.name);

  child.on("exit", (code, signal) => {
    if (isShuttingDown) return;

    isShuttingDown = true;
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[${command.name}] exited with ${reason}`);
    shutdownChildren();
    process.exit(code ?? 1);
  });
}

process.on("SIGINT", () => {
  isShuttingDown = true;
  shutdownChildren();
});

process.on("SIGTERM", () => {
  isShuttingDown = true;
  shutdownChildren();
});

function pipeOutput(stream, name) {
  stream.on("data", (chunk) => {
    const lines = chunk.toString().split(/\r?\n/);

    for (const line of lines) {
      if (line) {
        console.log(`[${name}] ${line}`);
      }
    }
  });
}

function shutdownChildren() {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
}
