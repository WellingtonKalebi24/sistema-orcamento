import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const stageRoot = join(tmpdir(), "sistema-orcamento-demo-zip");
const stage = join(stageRoot, "sistema-orcamento-demo");
const output = join(root, "sistema-orcamento-demo.zip");

const excludedDirectories = new Set([
  ".git",
  "node_modules",
  ".logs",
  ".tmp-demo-zip",
  "coverage",
  "backend/uploads",
  "backend/storage",
  "backend/backend",
  "backend/dist",
  "frontend/dist",
]);

const excludedFiles = new Set([".env", "sistema-orcamento-demo.zip"]);

function normalize(path) {
  return path.replaceAll("\\", "/");
}

function isExcluded(source) {
  const relativePath = normalize(relative(root, source));
  const name = basename(source);
  const directory = statSync(source).isDirectory();

  if (directory && excludedDirectories.has(relativePath)) return true;
  if ([...excludedDirectories].some((excluded) => relativePath.startsWith(`${excluded}/`))) {
    return true;
  }
  if (!directory && excludedFiles.has(relativePath)) return true;
  if (!directory && (name.endsWith(".log") || name.endsWith(".tsbuildinfo"))) return true;

  return false;
}

if (existsSync(stageRoot)) rmSync(stageRoot, { recursive: true, force: true });
if (existsSync(output)) rmSync(output, { force: true });
mkdirSync(dirname(stage), { recursive: true });

cpSync(root, stage, {
  recursive: true,
  filter: (source) => !isExcluded(source),
});

const command = [
  "-NoProfile",
  "-Command",
  `Compress-Archive -Path '${stage}\\*' -DestinationPath '${output}' -Force`,
];

const result = spawnSync("powershell.exe", command, { stdio: "inherit" });
rmSync(stageRoot, { recursive: true, force: true });

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(output);
