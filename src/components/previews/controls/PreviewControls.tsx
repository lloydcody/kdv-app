import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function PreviewControls({ onZoomIn, onZoomOut, onReset }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onZoomOut}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
      >
        <ZoomOut className="w-6 h-6" />
      </button>
      <button
        onClick={onReset}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
      >
        <RotateCcw className="w-6 h-6" />
      </button>
      <button
        onClick={onZoomIn}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
      >
        <ZoomIn className="w-6 h-6" />
      </button>
    </div>
  );
}