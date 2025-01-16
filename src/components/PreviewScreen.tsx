import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ImagePreview } from './previews/ImagePreview';
import { VideoPreview } from './previews/VideoPreview';
import { PDFPreview } from './previews/PDFPreview';
import { BottomBar } from './BottomBar';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
  onClose: () => void;
}

export function PreviewScreen({ file, onClose }: Props) {
  const [controls, setControls] = useState<any>({});

  const handleControlsChange = useCallback((newControls: any) => {
    setControls(prev => ({ ...prev, ...newControls }));
  }, []);

  const renderPreview = () => {
    if (file.mimeType.startsWith('image/')) {
      return <ImagePreview file={file} onControlsChange={handleControlsChange} />;
    }
    if (file.mimeType.startsWith('video/')) {
      return <VideoPreview file={file} onControlsChange={handleControlsChange} />;
    }
    if (file.mimeType === 'application/pdf') {
      return <PDFPreview file={file} onControlsChange={handleControlsChange} />;
    }
    return null;
  };

  return (
    <motion.div
      layoutId={`file-${file.id}`}
      initial={{ borderRadius: 24 }}
      animate={{ borderRadius: 0 }}
      className="fixed inset-0 bg-gray-900 flex flex-col"
    >
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
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