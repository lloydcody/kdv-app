import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { PaginationControls } from './controls/PaginationControls';
import { VideoControls } from './controls/VideoControls';
import type { DriveFile } from '../../types/drive';

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
  return (
    <div className="px-8 pb-8">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="h-32 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/10 flex items-center px-8"
      >
        <div className="flex-1 flex items-center">
          <motion.button
            onClick={onClose}
            className="bg-white/20 backdrop-blur-md text-white rounded-full p-4 hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="w-8 h-8" />
          </motion.button>
        </div>

        <div className="flex-[2] flex justify-center">
          {controls.video && <VideoControls {...controls.video} />}
          {controls.pagination && <PaginationControls {...controls.pagination} />}
        </div>

        <div className="flex-1" />
      </motion.div>
    </div>
  );
}