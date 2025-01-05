import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { DateTime } from './DateTime';
import { FileGrid } from '../FileGrid';
import type { DriveFile } from '../../types/drive';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
  onLogoClick: () => void;
}

export function HomeScreen({ files, onFileSelect, onLogoClick }: Props) {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollTop = 0;
    }
  }, [files]);

  return (
    <motion.div 
      className="h-[1080px] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fixed Top Section */}
      <div className="bg-white h-[260px] fixed top-0 left-0 right-0 z-10">
        <div className="max-w-[1820px] mx-auto px-12 h-full flex justify-between items-center">
          <Logo onLogoClick={onLogoClick} />
          <DateTime />
        </div>
      </div>

      {/* Scrollable Grid Section */}
      <div className="flex-1 bg-gradient-to-b from-[#1E3A8A] to-[#0D1B45] mt-[260px] min-h-[820px]">
        <div ref={gridContainerRef} className="max-w-[1820px] mx-auto p-12 overflow-y-auto max-h-[820px] scrollbar-hide touch-pan-y">
          <FileGrid files={files} onFileSelect={onFileSelect} />
        </div>
      </div>
    </motion.div>
  );
}