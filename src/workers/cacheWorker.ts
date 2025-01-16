import { getFilesToCache } from '../utils/fileUtils';
import { initializeCache, downloadFile, needsUpdate } from '../services/cacheService';
import type { DriveFile } from '../types/drive';
import type { WorkerUpdate } from '../types/worker';

let db: any;

async function initialize() {
  db = await initializeCache();
}

initialize();

self.onmessage = async (event: MessageEvent<DriveFile[]>) => {
  const files = getFilesToCache(event.data);
  let remaining = files.length;
  let processed = 0;
  let totalSpeed = 0;
  
  for (const file of files) {
    try {
      // Check if file needs updating
      const needsDownload = await needsUpdate(file);
      
      if (needsDownload) {
        const { speed } = await downloadFile(file);
        totalSpeed += speed;
      }
      
      processed++;
      remaining--;
      
      self.postMessage({
        type: 'progress',
        fileName: file.name,
        remaining,
        speed: totalSpeed / processed,
        progress: (processed / files.length) * 100
      } as WorkerUpdate);
    } catch (error) {
      console.error('Error processing file:', error);
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to cache file'
      } as WorkerUpdate);
    }
  }
  
  self.postMessage({ type: 'complete' } as WorkerUpdate);
};