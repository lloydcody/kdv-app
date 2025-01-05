export interface CachedFile {
  blob: Blob;
  versionHash: string;
  timestamp: number;
}

export interface CacheMetadata {
  versionHash: string;
  timestamp: number;
}