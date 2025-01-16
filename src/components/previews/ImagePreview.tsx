import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getCachedFile } from '../../services/cacheService';
import { PreviewContainer } from './PreviewContainer';
import { usePreviewSize } from '../../hooks/usePreviewSize';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
}

export function ImagePreview({ file, onControlsChange }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const size = usePreviewSize(containerRef, aspectRatio);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);
  }, [file.id]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setAspectRatio(img.naturalWidth / img.naturalHeight);
  };

  if (!src) return null;

  return (
    <PreviewContainer ref={containerRef}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit
        limitToBounds
        wheel={{ disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
        >
          <img
            src={src}
            alt={file.name}
            className="object-contain"
            style={{ width: size.width, height: size.height }}
            onLoad={handleImageLoad}
          />
        </TransformComponent>
      </TransformWrapper>
    </PreviewContainer>
  );
}