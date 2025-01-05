import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_CONFIG } from '../config/apiConfig';
import { getCachedFile } from '../services/cacheService';
import type { DriveFile } from '../types/drive';

interface Props {
  onUnlock: () => void;
}

function isImageFile(file: DriveFile): boolean {
  return file.mimeType.startsWith('image/');
}

export function LockScreen({ onUnlock }: Props) {
  const [idleFiles, setIdleFiles] = useState<DriveFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load idle files
  useEffect(() => {
    fetch(`${API_CONFIG.baseUrl}/files?folder=Idle Screen`)
      .then(res => res.json())
      .then(files => setIdleFiles(files.filter(isImageFile)));
  }, []);

  // Preload current and next files
  useEffect(() => {
    if (idleFiles.length > 0) {
      const currentFile = idleFiles[currentIndex];
      const nextIndex = (currentIndex + 1) % idleFiles.length;
      const nextFile = idleFiles[nextIndex];

      Promise.all([
        getCachedFile(currentFile.id),
        getCachedFile(nextFile.id)
      ]).then(([current, next]) => {
        setCurrentSrc(current);
        setNextSrc(next);
      });
    }
  }, [idleFiles, currentIndex]);

  // Handle transitions
  useEffect(() => {
    if (idleFiles.length > 0) {
      const transitionTimer = setInterval(() => {
        setIsTransitioning(true);
      }, 8000); // Start transition after 8 seconds

      const updateTimer = setInterval(() => {
        if (isTransitioning) {
          setCurrentIndex(i => (i + 1) % idleFiles.length);
          setIsTransitioning(false);
        }
      }, 1000); // Update index after 1 second transition

      return () => {
        clearInterval(transitionTimer);
        clearInterval(updateTimer);
      };
    }
  }, [idleFiles.length, isTransitioning]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black"
    >
      <div className="absolute inset-0">
        {/* Current image */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {currentSrc && (
            <img
              src={currentSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Next image (preloaded) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {nextSrc && (
            <img
              src={nextSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </div>

      <motion.button
        onClick={onUnlock}
        className="absolute inset-0 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-full p-8">
          <span className="text-white text-xl font-semibold">
            Touch here to begin
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}