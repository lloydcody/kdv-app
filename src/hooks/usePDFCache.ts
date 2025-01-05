import { useState, useCallback } from 'react';
import { getCachedFile } from '../services/cacheService';

const pdfCache = new Map<string, string>();

export function usePDFCache() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const loadPDF = useCallback(async (fileId: string) => {
    // Check cache first
    if (pdfCache.has(fileId)) {
      setPdfUrl(pdfCache.get(fileId)!);
      return;
    }

    // Load and cache if not found
    const url = await getCachedFile(fileId);
    if (url) {
      pdfCache.set(fileId, url);
      setPdfUrl(url);
    }
  }, []);

  return { pdfUrl, loadPDF };
}