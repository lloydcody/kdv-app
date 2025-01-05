import { openDB } from 'idb';
import { API_CONFIG } from '../config/api';
import { CACHE_CONFIG } from '../config/cache';
import { CacheStore } from './stores/cacheStore';
import type { DriveFile } from '../types/drive';
import type { CachedFile, CacheMetadata } from '../types/cache';

let cacheStore: CacheStore | null = null;

export async function initializeCache(): Promise<CacheStore> {
  if (!cacheStore) {
    const db = await openDB(CACHE_CONFIG.dbName, CACHE_CONFIG.version, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains(CACHE_CONFIG.stores.files)) {
          db.createObjectStore(CACHE_CONFIG.stores.files);
        }
        if (!db.objectStoreNames.contains(CACHE_CONFIG.stores.metadata)) {
          db.createObjectStore(CACHE_CONFIG.stores.metadata);
        }
      },
    });
    cacheStore = new CacheStore(db);
  }
  return cacheStore;
}

export async function getCachedFile(fileId: string): Promise<string | null> {
  const store = await initializeCache();
  return store.getFile(fileId);
}

export async function getFileMetadata(fileId: string): Promise<CacheMetadata | null> {
  const store = await initializeCache();
  return store.getMetadata(fileId);
}

export async function needsUpdate(file: DriveFile): Promise<boolean> {
  const store = await initializeCache();
  return store.needsUpdate(file);
}

export async function downloadFile(file: DriveFile): Promise<{ blob: Blob; speed: number }> {
  const store = await initializeCache();
  return store.downloadAndCache(file);
}