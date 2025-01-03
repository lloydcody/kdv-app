import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InstanceInfo } from '../types/instance';

export function useInstanceInfo() {
  const [instanceInfo, setInstanceInfo] = useState<InstanceInfo | null>(null);

  useEffect(() => {
    const initializeInstance = async () => {
      // Get kioskId from URL or default
      const params = new URLSearchParams(window.location.search);
      const kioskId = params.get('kioskid') || 'default';
      
      // Generate instance UUID and start time
      const instanceId = uuidv4();
      const startTime = new Date();

      // Load Thumbmark.js and generate device ID
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/thumbmarkjs/thumbmarkjs@main/dist/thumbmark.min.js';
      
      script.onload = async () => {
        // @ts-ignore - Thumbmark is loaded globally
        const thumbmark = new Thumbmark();
        const thumbmarkId = await thumbmark.generate();
        
        setInstanceInfo({
          kioskId,
          instanceId,
          thumbmarkId,
          startTime
        });
      };

      document.head.appendChild(script);
    };

    initializeInstance();
  }, []);

  return instanceInfo;
}