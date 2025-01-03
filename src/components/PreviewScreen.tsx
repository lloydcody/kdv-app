import React, { useEffect, useCallback } from 'react';
import { Home } from 'lucide-react';
import { ImagePreview } from './previews/ImagePreview';
import { VideoPreview } from './previews/VideoPreview';
import { PDFPreview } from './previews/PDFPreview';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
  onClose: () => void;
}

export function PreviewScreen({ file, onClose }: Props) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const renderPreview = () => {
    if (file.mimeType.startsWith('image/')) {
      return <ImagePreview file={file} />;
    }
    if (file.mimeType.startsWith('video/')) {
      return <VideoPreview file={file} />;
    }
    if (file.mimeType === 'application/pdf') {
      return <PDFPreview file={file} />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {renderPreview()}
        </div>
      </div>
      <div className="h-32 bg-gray-800 border-t border-gray-700 flex items-center px-8">
        <div className="flex-1 flex items-center">
          <button
            onClick={onClose}
            className="bg-white text-gray-900 rounded-full p-3 hover:bg-gray-200 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-[2] flex justify-center">
          {/* Preview controls are rendered within each preview component */}
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}