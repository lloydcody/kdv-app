import React from 'react';
import { motion } from 'framer-motion';
import { ImageCarousel } from './ImageCarousel';
import { getDefaultIdleFiles } from '../../utils/fileUtils';
import type { DriveFile } from '../../types/drive';

interface Props {
  onUnlock: () => void;
  files: DriveFile[];
}

export function LockScreen({ onUnlock, files }: Props) {
  const idleFiles = getDefaultIdleFiles(files);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black"
    >
      {idleFiles.length > 0 && <ImageCarousel files={idleFiles} />}

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