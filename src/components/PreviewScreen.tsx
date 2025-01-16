import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePreview } from './previews/ImagePreview';
import { VideoPreview } from './previews/VideoPreview';
import { PDFPreview } from './previews/PDFPreview';
import { EmbeddedPreview } from './previews/EmbeddedPreview';
import { BottomBar } from './previews/BottomBar';
import { useEscapeKey } from '../hooks/useEscapeKey';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
  onClose: () => void;
}

export function PreviewScreen({ file, onClose }: Props) {
  const [controls, setControls] = useState<any>({});
  const [isVisible, setIsVisible] = useState(true);

  useEscapeKey(() => handleClose());

  const handleControlsChange = useCallback((newControls: any) => {
    setControls(prev => ({ ...prev, ...newControls }));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleExitComplete = () => {
    onClose();
  };

  const renderPreview = () => {
    if (file.type === 'embedded' && file.embeddedUrl) {
      return <EmbeddedPreview url={file.embeddedUrl} />;
    }
    if (file.mimeType.startsWith('image/')) {
      return <ImagePreview file={file} onControlsChange={handleControlsChange} />;
    }
    if (file.mimeType.startsWith('video/')) {
      return <VideoPreview file={file} onControlsChange={handleControlsChange} onClose={handleClose} />;
    }
    if (file.mimeType === 'application/pdf') {
      return <PDFPreview file={file} onControlsChange={handleControlsChange} />;
    }
    return null;
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          layoutId={`file-${file.id}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed',
            inset: 0,
            zIndex: 100
          }}
          className="bg-gradient-to-b from-[#1E3A8A] to-[#0D1B45]"
          transition={{ 
            layout: { duration: 0.3 },
            opacity: { duration: 0.3 }
          }}
        >
          {/* Content Container */}
          <div className="absolute inset-0 bottom-32">
            <div className="w-full h-full p-8 pb-12">
              <div className="w-full h-full bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                {renderPreview()}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0">
            <BottomBar
              file={file}
              onClose={handleClose}
              controls={controls}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}