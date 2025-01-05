import React, { useState, useEffect } from 'react';
import { getCachedFile } from '../services/cacheService';
import type { DriveFile } from '../types/drive';

interface Props {
  file: DriveFile;
}

export function ThumbnailImage({ file }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (file.hasThumbnail) {
      getCachedFile(`thumb_${file.id}`).then(setSrc);
    }
  }, [file.id, file.hasThumbnail]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
    />
  );
}