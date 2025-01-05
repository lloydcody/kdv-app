import React from 'react';
import { motion } from 'framer-motion';
import { ImageCarousel } from './IdleScreen/ImageCarousel';
import { BeginButton } from './IdleScreen/BeginButton';
import { getDefaultIdleFiles } from '../utils/fileUtils';
import type { DriveFile } from '../types/drive';

interface Props {
  onDismiss: () => void;
  files: DriveFile[];
}

export function IdleScreen({ onDismiss, files }: Props) {
  const idleFiles = getDefaultIdleFiles(files);

  return (
    <motion.button
      onClick={onDismiss}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black w-full h-full border-0"
    >
      {idleFiles.length > 0 && <ImageCarousel files={idleFiles} />}
      <BeginButton />
    </motion.button>
  );
}