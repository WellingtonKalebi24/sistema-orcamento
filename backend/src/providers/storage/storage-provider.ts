export type StoredFile = {
  storageKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type FileToStore = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
};

export interface StorageProvider {
  save(file: FileToStore): Promise<StoredFile>;
  read(storageKey: string): Promise<Buffer>;
  remove(storageKey: string): Promise<void>;
}
