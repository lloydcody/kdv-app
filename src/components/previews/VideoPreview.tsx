import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isVisible, setIsVisible] = useState(true);
  const fadeAudio = useAudioFade();
  const size = usePreviewSize(containerRef, aspectRatio);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
      if (fadeRef.current) {
        fadeRef.current();
      }
    };
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

  const handleClose = () => {
    if (videoRef.current) {
      if (fadeRef.current) fadeRef.current();
      fadeRef.current = fadeAudio(videoRef.current, false, 300);
      videoRef.current.pause();
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!src) return null;

  return (
    <PreviewContainer ref={containerRef}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </PreviewContainer>
  );
}