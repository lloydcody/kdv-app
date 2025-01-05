import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import { useCarouselTimer } from '../../hooks/useCarouselTimer';
import type { DriveFile } from '../../types/drive';

interface Props {
  files: DriveFile[];
}

export function ImageCarousel({ files }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentSrc, nextSrc } = useImagePreloader(files, currentIndex);
  const { isTransitioning } = useCarouselTimer(8000, () => {
    setCurrentIndex(i => (i + 1) % files.length);
  });

  if (!currentSrc) return null;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={currentSrc}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}