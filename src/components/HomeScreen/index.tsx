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
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollTop = 0;
    }

    // Initialize weather widget
    if (!document.getElementById('weatherwidget-io-js')) {
      scriptRef.current = document.createElement('script');
      scriptRef.current.id = 'weatherwidget-io-js-init';
      scriptRef.current.innerHTML = `!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');`;
      document.body.appendChild(scriptRef.current);
    }

    return () => {
      // Clean up weather widget script
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
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
          <div className="flex items-center gap-8">
            <Logo onLogoClick={onLogoClick} />
            <a 
              className="weatherwidget-io" 
              href="https://forecast7.com/en/n33d87151d21/sydney/" 
              data-font="Open Sans" 
              data-days="3" 
              data-theme="pure" 
              data-basecolor="rgba(255, 255, 255, 0)" 
              data-highcolor="#000000" 
              data-lowcolor="#aaaaaa" 
              data-suncolor="#c6af9e" 
              data-snowcolor="#2274cb"
            >
              Sydney NSW, Australia
            </a>
          </div>
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