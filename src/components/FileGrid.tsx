import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bell } from 'lucide-react';
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
          key={`file-${file.id}`}
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
          className={`group relative overflow-hidden aspect-[2/1.2] shadow-[0_8px_16px_rgba(0,0,0,0.3)] ${
            file.type === 'embedded' ? 'bg-gradient-to-br from-white to-gray-100' : 'bg-gradient-to-br from-[#B8860B] to-[#DAA520]'
          }`}
          transition={{
            layout: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          {/* Thumbnail/Icon Section */}
          <div className="absolute inset-x-0 top-0 h-[75%] overflow-hidden flex items-center justify-center">
            {file.type === 'embedded' ? (
              file.id === 'staff-directory' ? (
                <Users className="w-24 h-24 text-[#1E3A8A]" />
              ) : (
                <Bell className="w-24 h-24 text-[#1E3A8A]" />
              )
            ) : (
              <ThumbnailImage file={file} />
            )}
          </div>

          {/* Title Section */}
          <div className={`absolute inset-x-0 bottom-0 h-[25%] flex items-center px-4 ${
            file.type === 'embedded' 
              ? 'bg-gradient-to-t from-gray-200 to-transparent'
              : 'bg-gradient-to-t from-[#5E5538] to-[#90845C]'
          }`}>
            <p className={`text-sm font-normal truncate ${
              file.type === 'embedded' ? 'text-[#1E3A8A]' : 'text-white'
            }`}>
              {formatDisplayName(file.name)}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}