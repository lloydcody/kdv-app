import React from 'react';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaginationControls } from './previews/controls/PaginationControls';
import { PreviewControls } from './previews/controls/PreviewControls';
import { VideoControls } from './previews/controls/VideoControls';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
  onClose: () => void;
  controls: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      onPrevPage: () => void;
      onNextPage: () => void;
    };
    preview?: {
      onZoomIn: () => void;
      onZoomOut: () => void;
      onReset: () => void;
    };
    video?: {
      isPlaying: boolean;
      isMuted: boolean;
      progress: number;
      onPlayPause: () => void;
      onMuteToggle: () => void;
      onSeek: (e: React.MouseEvent<HTMLDivElement>, seekBar: HTMLDivElement) => void;
    };
  };
}

export function BottomBar({ file, onClose, controls }: Props) {
  const showPreviewControls = file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 inset-x-0 h-32 bg-gray-800 border-t border-gray-700 flex items-center px-8"
    >
      <div className="flex-1 flex items-center">
        <motion.button
          onClick={onClose}
          className="bg-white text-gray-900 rounded-full p-3 hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex-[2] flex justify-center gap-8">
        {controls.video && <VideoControls {...controls.video} />}
        {controls.pagination && <PaginationControls {...controls.pagination} />}
        {showPreviewControls && controls.preview && <PreviewControls {...controls.preview} />}
      </div>

      <div className="flex-1" />
    </motion.div>
  );
}