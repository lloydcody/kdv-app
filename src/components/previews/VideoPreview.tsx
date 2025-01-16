import React, { useRef, useState, useEffect } from 'react';
import { getCachedFile } from '../../services/cacheService';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
}

export function VideoPreview({ file, onControlsChange }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);
  }, [file.id]);

  useEffect(() => {
    if (videoRef.current && src) {
      videoRef.current.play();
    }
  }, [src]);

  useEffect(() => {
    onControlsChange({
      video: {
        isPlaying,
        isMuted,
        progress,
        onPlayPause: () => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
          }
        },
        onMuteToggle: () => {
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
          }
        },
        onSeek: (e: React.MouseEvent<HTMLDivElement>, seekBar: HTMLDivElement) => {
          if (videoRef.current) {
            const rect = seekBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = position * videoRef.current.duration;
            setProgress(position * 100);
          }
        }
      }
    });
  }, [isPlaying, isMuted, progress, onControlsChange]);

  if (!src) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        className="max-h-full max-w-full"
        autoPlay
        onTimeUpdate={() => {
          if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
          }
        }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }}
      />
    </div>
  );
}