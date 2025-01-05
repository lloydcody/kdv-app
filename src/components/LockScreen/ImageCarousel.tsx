import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCarouselTimer } from '../../hooks/useCarouselTimer';
import { useImagePreloader } from '../../hooks/useImagePreloader';
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
      {/* Current image */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img
          src={currentSrc}
          alt=""
          className="w-full h-full object-cover"
        />
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
  );
}