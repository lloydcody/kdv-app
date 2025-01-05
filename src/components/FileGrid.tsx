import React from 'react';
import { motion } from 'framer-motion';
import { ThumbnailImage } from './ThumbnailImage';
import { formatDisplayName } from '../utils/fileUtils';
import type { DriveFile } from '../types/drive';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
}

export function FileGrid({ files, onFileSelect }: Props) {
  return (
    <div className="grid grid-cols-5 gap-12">
      {files.map((file) => (
        <motion.button
          key={file.id}
          layoutId={`file-${file.id}`}
          onClick={() => onFileSelect(file)}
          style={{ 
            borderRadius: 20,
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ 
            scale: 1.05,
            zIndex: 2,
            transition: { duration: 0.3 }
          }}
          className="group relative bg-gradient-to-br from-[#B8860B] to-[#DAA520] overflow-hidden aspect-[2/1.2] shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
          transition={{
            layout: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          {/* Thumbnail Section */}
          <div className="absolute inset-x-0 top-0 h-[75%] overflow-hidden">
            <ThumbnailImage file={file} />
          </div>

          {/* Title Section */}
          <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-[#5E5538] to-[#90845C] flex items-center px-4">
            <p className="text-white text-sm font-normal truncate">
              {formatDisplayName(file.name)}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}