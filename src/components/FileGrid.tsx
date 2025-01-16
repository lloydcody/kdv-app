import React from 'react';
import { motion } from 'framer-motion';
import { ThumbnailImage } from './ThumbnailImage';
import { formatDisplayName, sortFiles } from '../utils/fileUtils';
import type { DriveFile } from '../types/drive';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
}

export function FileGrid({ files, onFileSelect }: Props) {
  const sortedFiles = sortFiles(files);

  return (
    <div className="grid grid-cols-3 xl:grid-cols-5 gap-8">
      {sortedFiles.map((file) => (
        <motion.button
          key={file.id}
          layoutId={`file-${file.id}`}
          onClick={() => onFileSelect(file)}
          className="group relative bg-gradient-to-br from-red-800 to-red-900 rounded-2xl shadow-2xl overflow-hidden aspect-[2/1]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Thumbnail Section */}
          <div className="absolute inset-x-0 top-0 h-3/4 overflow-hidden">
            <ThumbnailImage file={file} />
          </div>

          {/* Title Section */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-black/50 backdrop-blur-sm p-4">
            <p className="text-white text-lg font-medium truncate">
              {formatDisplayName(file.name)}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}