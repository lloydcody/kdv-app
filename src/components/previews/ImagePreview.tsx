import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { API_CONFIG } from '../../config/apiConfig';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
}

export function ImagePreview({ file }: Props) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={2}
      centerOnInit
      limitToBounds
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <TransformComponent wrapperClass="w-full h-full" contentClass="h-full flex items-center justify-center">
            <img
              src={`${API_CONFIG.baseUrl}/files/${file.id}/preview`}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          </TransformComponent>
          <div className="absolute bottom-0 inset-x-0 h-32 flex items-center justify-center gap-4">
            <button
              onClick={() => zoomOut()}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <button
              onClick={() => resetTransform()}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={() => zoomIn()}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </TransformWrapper>
  );
}