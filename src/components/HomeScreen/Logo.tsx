import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/apiConfig';
import { getCachedFile } from '../../services/cacheService';

interface Props {
  onLogoClick: () => void;
}

export function Logo({ onLogoClick }: Props) {
  const [logoSrc, setLogoSrc] = useState<string | null>(
    `${API_CONFIG.baseUrl}/files/1WGBVSOENi2tb9eolICE_B5PMEv3XKsHa/preview`
  );
  const logoId = '1WGBVSOENi2tb9eolICE_B5PMEv3XKsHa';

  useEffect(() => {
    getCachedFile(logoId).then(cachedSrc => {
      if (cachedSrc) {
        setLogoSrc(cachedSrc);
      }
    });
  }, []);

  return (
    <button 
      onClick={onLogoClick}
      className="border-0 bg-transparent p-0"
    >
      <img 
        src={logoSrc}
        alt="Logo" 
        className="h-[80px] object-contain pl-5"
      />
    </button>
  );
}