import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { env } from "../../config/env";
import type { FileToStore, StorageProvider } from "./storage-provider";

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly baseDir = path.resolve(env.UPLOAD_DIR)) {}

  async save(file: FileToStore) {
    await mkdir(this.baseDir, { recursive: true });
    const extension = path.extname(file.originalName).toLowerCase();
    const storageKey = `${randomUUID()}${extension}`;
    const target = path.join(this.baseDir, storageKey);
    await writeFile(target, file.buffer);
    return {
      storageKey,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.buffer.length,
    };
  }

  async read(storageKey: string) {
    return readFile(path.join(this.baseDir, path.basename(storageKey)));
  }

  async remove(storageKey: string) {
    await rm(path.join(this.baseDir, path.basename(storageKey)), { force: true });
  }
}
