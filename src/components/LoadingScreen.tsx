import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_CONFIG } from '../config/apiConfig';
import type { WorkerUpdate } from '../types/worker';

interface Props {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const cacheWorker = new Worker(
      new URL('../workers/cacheWorker.ts', import.meta.url),
      { type: 'module' }
    );

    cacheWorker.onmessage = (event: MessageEvent<WorkerUpdate>) => {
      const update = event.data;
      
      switch (update.type) {
        case 'progress':
          setProgress(update.progress);
          setCurrentFile(update.fileName);
          setRemaining(update.remaining);
          setSpeed(update.speed);
          break;
        case 'error':
          setError(update.message);
          break;
        case 'complete':
          onLoadingComplete();
          break;
      }
    };

    setWorker(cacheWorker);

    return () => {
      cacheWorker.terminate();
    };
  }, [onLoadingComplete]);

  useEffect(() => {
    if (worker) {
      fetch(`${API_CONFIG.baseUrl}/files`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch file list');
          return res.json();
        })
        .then(files => {
          worker.postMessage(files);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [worker]);

  const formatSpeed = (bytesPerSecond: number) => {
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(1)} MB/s`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <p className="text-red-500 text-xl text-center">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8"
    >
      <div className="w-96 space-y-8">
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-gray-300 text-sm">
            <span>{Math.round(progress)}%</span>
            <span>{formatSpeed(speed)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-white text-center truncate">
            {currentFile}
          </p>
          <p className="text-gray-300 text-sm text-center">
            {remaining} files remaining
          </p>
        </div>
      </div>
    </motion.div>
  );
}