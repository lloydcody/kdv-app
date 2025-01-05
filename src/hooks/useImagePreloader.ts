import { useState, useEffect } from 'react';
import { getCachedFile } from '../services/cacheService';
import type { DriveFile } from '../types/drive';

export function useImagePreloader(files: DriveFile[], currentIndex: number) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [nextSrc, setNextSrc] = useState<string | null>(null);

  useEffect(() => {
    if (files.length === 0) return;

    const nextIndex = (currentIndex + 1) % files.length;
    
    // Use the cached files
    Promise.all([
      getCachedFile(files[currentIndex].id),
      getCachedFile(files[nextIndex].id)
    ]).then(([current, next]) => {
      setCurrentSrc(current);
      setNextSrc(next);
    });
  }, [files, currentIndex]);

  return { currentSrc, nextSrc };
}