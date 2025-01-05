import { useState, useEffect, useCallback } from 'react';

interface PreviewSize {
  width: number;
  height: number;
}

export function usePreviewSize(containerRef: React.RefObject<HTMLDivElement>, aspectRatio?: number) {
  const [size, setSize] = useState<PreviewSize>({ width: 0, height: 0 });

  const calculateSize = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 64; // Account for padding
    const containerHeight = container.clientHeight - 64;

    if (aspectRatio) {
      // If we have an aspect ratio, fit within container while maintaining it
      const heightByWidth = containerWidth / aspectRatio;
      const widthByHeight = containerHeight * aspectRatio;

      if (heightByWidth <= containerHeight) {
        setSize({ width: containerWidth, height: heightByWidth });
      } else {
        setSize({ width: widthByHeight, height: containerHeight });
      }
    } else {
      // Otherwise just use container dimensions
      setSize({ width: containerWidth, height: containerHeight });
    }
  }, [aspectRatio]);

  useEffect(() => {
    calculateSize();
    const observer = new ResizeObserver(calculateSize);
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculateSize]);

  return size;
}