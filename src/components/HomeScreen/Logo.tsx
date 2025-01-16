import React, { useState, useEffect } from 'react';
import { getCachedFile } from '../../services/cacheService';
import { findFolderByPath } from '../../utils/fileUtils';
import type { DriveFile } from '../../types/drive';

interface Props {
  files: DriveFile[];
}

export function Logo({ files }: Props) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    const logoFolder = findFolderByPath(files, ['Settings', 'Logo']);
    if (logoFolder?.children?.[0]) {
      getCachedFile(logoFolder.children[0].id).then(setLogoSrc);
    }
  }, [files]);

  if (!logoSrc) return null;

  return (
    <img src={logoSrc} alt="Logo" className="h-12 object-contain" />
  );
}