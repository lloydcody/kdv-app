import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getCachedFile } from '../../services/cacheService';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
}

export function ImagePreview({ file, onControlsChange }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);
  }, [file.id]);

  if (!src) return null;

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.1}
      maxScale={2}
      centerOnInit
      limitToBounds
      onZoomChange={({ state }) => {
        onControlsChange({
          preview: {
            onZoomIn: state.zoomIn,
            onZoomOut: state.zoomOut,
            onReset: state.resetTransform
          }
        });
      }}
    >
      <TransformComponent
        wrapperClass="w-full h-full"
        contentClass="h-full flex items-center justify-center"
      >
        <img
          src={src}
          alt={file.name}
          className="max-h-full max-w-full object-contain"
          style={{ margin: 'auto' }}
        />
      </TransformComponent>
    </TransformWrapper>
  );
}