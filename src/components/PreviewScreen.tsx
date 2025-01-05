import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ImagePreview } from './previews/ImagePreview';
import { VideoPreview } from './previews/VideoPreview';
import { PDFPreview } from './previews/PDFPreview';
import { BottomBar } from './previews/BottomBar';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
  onClose: () => void;
}

export function PreviewScreen({ file, onClose }: Props) {
  const [controls, setControls] = useState<any>({});

  useEscapeKey(onClose);

  const handleControlsChange = useCallback((newControls: any) => {
    setControls(prev => ({ ...prev, ...newControls }));
  }, []);

  const renderPreview = () => {
    if (file.mimeType.startsWith('image/')) {
      return <ImagePreview file={file} onControlsChange={handleControlsChange} />;
    }
    if (file.mimeType.startsWith('video/')) {
      return <VideoPreview file={file} onControlsChange={handleControlsChange} onClose={onClose} />;
    }
    if (file.mimeType === 'application/pdf') {
      return <PDFPreview file={file} onControlsChange={handleControlsChange} />;
    }
    return null;
  };

  return (
    <motion.div
      layoutId={`file-${file.id}`}
      style={{ 
        position: 'fixed',
        inset: 0,
        zIndex: 100
      }}
      className="bg-gradient-to-b from-[#1E3A8A] to-[#0D1B45] flex flex-col"
      transition={{ 
        layout: { duration: 0.3 },
        opacity: { duration: 0.3 }
      }}
    >
      <div className="flex-1 p-8 pb-4">
        <div className="w-full h-full bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden">
          {renderPreview()}
        </div>
      </div>
      <BottomBar
        file={file}
        onClose={onClose}
        controls={controls}
      />
    </motion.div>
  );
}