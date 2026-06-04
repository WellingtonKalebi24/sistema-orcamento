import { mkdir, writeFile } from "node:fs/promises";
import openapiTS, { astToString } from "openapi-typescript";

const source = new URL("../specs/001-sistema-orcamentos/contracts/openapi.yaml", import.meta.url);
const outputDirectory = new URL("../frontend/src/lib/api/", import.meta.url);
const outputFile = new URL("schema.d.ts", outputDirectory);

await mkdir(outputDirectory, { recursive: true });
const definitions = await openapiTS(source);
await writeFile(outputFile, astToString(definitions), "utf8");

console.log("Tipos da API gerados em frontend/src/lib/api/schema.d.ts.");
