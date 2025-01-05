import React, { useState, useEffect, useRef } from 'react';
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
      <img
        src={src}
        alt={file.name}
        className="object-contain"
        style={{ width: size.width, height: size.height }}
        onLoad={handleImageLoad}
      />
    </PreviewContainer>
  );
}