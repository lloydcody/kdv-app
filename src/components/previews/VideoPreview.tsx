import React, { useRef, useState, useEffect } from 'react';
import { useAudioFade } from '../../hooks/useAudioFade';
import { usePreviewSize } from '../../hooks/usePreviewSize';
import { getCachedFile } from '../../services/cacheService';
import { PreviewContainer } from './PreviewContainer';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
  onClose: () => void;
}

export function VideoPreview({ file, onControlsChange, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<(() => void) | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const fadeAudio = useAudioFade();
  const size = usePreviewSize(containerRef, aspectRatio);

  // Cleanup on unmount - fade out audio
  useEffect(() => {
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        fadeAudio(videoRef.current, false, 300);
      }
    };
  }, [fadeAudio]);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);
  }, [file.id]);

  useEffect(() => {
    onControlsChange({
      video: {
        isPlaying,
        isMuted,
        progress,
        onPlayPause: () => {
          if (videoRef.current) {
            if (isPlaying) {
              if (fadeRef.current) fadeRef.current();
              fadeRef.current = fadeAudio(videoRef.current, false, 300);
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }, 300);
            } else {
              videoRef.current.play();
              if (fadeRef.current) fadeRef.current();
              fadeRef.current = fadeAudio(videoRef.current, true, 300);
              setIsPlaying(true);
            }
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
          }
        }
      }
    });
  }, [isPlaying, isMuted, progress, onControlsChange, fadeAudio]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setAspectRatio(videoRef.current.videoWidth / videoRef.current.videoHeight);
      videoRef.current.volume = 0;
      fadeRef.current = fadeAudio(videoRef.current, true, 300);
      videoRef.current.play().catch(console.error);
    }
  };

  if (!src) return null;

  return (
    <PreviewContainer ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        className="object-contain"
        style={{ width: size.width, height: size.height }}
        autoPlay
        playsInline
        muted={isMuted}
        onLoadedMetadata={handleVideoLoad}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
          }
        }}
        onEnded={() => {
          if (videoRef.current) {
            if (fadeRef.current) fadeRef.current();
            fadeRef.current = fadeAudio(videoRef.current, false, 300);
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.pause();
                setIsPlaying(false);
              }
            }, 300);
          }
        }}
      />
    </PreviewContainer>
  );
}