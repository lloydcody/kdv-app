import React from 'react';
import { Logo } from './Logo';
import { DateTime } from './DateTime';
import { Weather } from './Weather';
import { FileGrid } from '../FileGrid';
import type { DriveFile } from '../../types/drive';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
}

export function HomeScreen({ files, onFileSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Section */}
      <div className="bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <Logo files={files} />
          <DateTime />
          <Weather />
        </div>
      </div>

      {/* Files Grid Section */}
      <div className="flex-1 bg-gradient-to-b from-blue-600 to-blue-800 p-8">
        <div className="max-w-7xl mx-auto mt-auto">
          <FileGrid files={files} onFileSelect={onFileSelect} />
        </div>
      </div>
    </div>
  );
}