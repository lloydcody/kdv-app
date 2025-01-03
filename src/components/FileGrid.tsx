import React from 'react';
import { FileIcon, Film, Image } from 'lucide-react';
import type { DriveFile } from '../types/drive';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <Image className="w-12 h-12" />;
  if (mimeType.startsWith('video/')) return <Film className="w-12 h-12" />;
  return <FileIcon className="w-12 h-12" />;
}

function isAllowedFileType(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf'
  );
}

export function FileGrid({ files, onFileSelect }: Props) {
  const allowedFiles = files.filter(file => isAllowedFileType(file.mimeType));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {allowedFiles.map((file) => (
        <button
          key={file.id}
          onClick={() => onFileSelect(file)}
          className="group aspect-video bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors text-white"
        >
          <div className="mb-2 text-gray-300 group-hover:text-white transition-colors">
            {getFileIcon(file.mimeType)}
          </div>
          <p className="text-sm text-center truncate w-full">
            {file.name}
          </p>
        </button>
      ))}
    </div>
  );
}