import { getFilesToCache } from '../utils/fileUtils';
import { initializeCache, downloadFile, needsUpdate } from '../services/cacheService';
import type { DriveFile } from '../types/drive';
import type { WorkerUpdate } from '../types/worker';

let db: any;

async function initialize() {
  db = await initializeCache();
}

initialize();

self.onmessage = async (event: MessageEvent<{ files: DriveFile[]; tags: string[] }>) => {
  const { files, tags } = event.data;
  
  // Send initial status
  self.postMessage({
    type: 'status',
    message: 'Analyzing files...'
  } as WorkerUpdate);

  const filesToCache = getFilesToCache(files, tags);
  let remaining = filesToCache.length;
  let processed = 0;
  let totalSpeed = 0;
  let needsUpdateCount = 0;
  
  // First check which files need updating
  for (const file of filesToCache) {
    self.postMessage({
      type: 'status',
      message: `Checking file: ${file.name}`
    } as WorkerUpdate);

    const needsDownload = await needsUpdate(file);
    if (needsDownload) {
      needsUpdateCount++;
    }
  }

  if (needsUpdateCount === 0) {
    self.postMessage({
      type: 'status',
      message: 'All files up to date'
    } as WorkerUpdate);
    self.postMessage({ type: 'complete' } as WorkerUpdate);
    return;
  }

  self.postMessage({
    type: 'status',
    message: `Downloading ${needsUpdateCount} files...`
  } as WorkerUpdate);
  
  // Then download files that need updating
  for (const file of filesToCache) {
    try {
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
        progress: (processed / filesToCache.length) * 100
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