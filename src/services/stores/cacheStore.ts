import { IDBPDatabase } from 'idb';
import { API_CONFIG } from '../../config/api';
import { CACHE_CONFIG } from '../../config/cache';
import type { DriveFile } from '../../types/drive';
import type { CachedFile, CacheMetadata } from '../../types/cache';

export class CacheStore {
  constructor(private db: IDBPDatabase) {}

  async getFile(fileId: string): Promise<string | null> {
    try {
      const cachedFile = await this.db.get(CACHE_CONFIG.stores.files, fileId) as CachedFile | undefined;
      return cachedFile ? URL.createObjectURL(cachedFile.blob) : null;
    } catch (error) {
      console.error('Error getting cached file:', error);
      return null;
    }
  }

  async getMetadata(fileId: string): Promise<CacheMetadata | null> {
    try {
      const metadata = await this.db.get(CACHE_CONFIG.stores.metadata, fileId) as CacheMetadata | undefined;
      return metadata || null;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  async needsUpdate(file: DriveFile): Promise<boolean> {
    try {
      const metadata = await this.getMetadata(file.id);
      return !metadata || metadata.versionHash !== file.versionHash;
    } catch (error) {
      console.error('Error checking file update:', error);
      return true;
    }
  }

  async downloadAndCache(file: DriveFile): Promise<{ blob: Blob; speed: number }> {
    const start = performance.now();
    
    try {
      const url = file.hasThumbnail && file.id.startsWith('thumb_')
        ? `${API_CONFIG.baseUrl}/files/${file.id.replace('thumb_', '')}/thumbnail`
        : `${API_CONFIG.baseUrl}/files/${file.id}/preview`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download ${file.name}`);
      }
      
      const blob = await response.blob();
      const end = performance.now();
      const speed = blob.size / ((end - start) / 1000);
      
      const tx = this.db.transaction([CACHE_CONFIG.stores.files, CACHE_CONFIG.stores.metadata], 'readwrite');
      
      const fileData: CachedFile = {
        blob,
        versionHash: file.versionHash,
        timestamp: Date.now()
      };
      
      const metadata: CacheMetadata = {
        versionHash: file.versionHash,
        timestamp: Date.now()
      };
      
      await Promise.all([
        tx.objectStore(CACHE_CONFIG.stores.files).put(fileData, file.id),
        tx.objectStore(CACHE_CONFIG.stores.metadata).put(metadata, file.id)
      ]);
      
      await tx.done;
      
      return { blob, speed };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}