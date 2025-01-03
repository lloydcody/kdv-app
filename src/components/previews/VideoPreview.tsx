import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { API_CONFIG } from '../../config/apiConfig';
import type { DriveFile } from '../../types/drive';

interface Props {
  file: DriveFile;
}

export function VideoPreview({ file }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        setLastPosition(videoRef.current.currentTime);
        videoRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && lastPosition > 0) {
      videoRef.current.currentTime = lastPosition;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [lastPosition, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, seekBar: HTMLDivElement) => {
    if (videoRef.current) {
      const rect = seekBar.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = position * videoRef.current.duration;
      setProgress(position * 100);
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={`${API_CONFIG.baseUrl}/files/${file.id}/preview`}
        className="max-h-full max-w-full"
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <div className="absolute bottom-0 inset-x-0 h-32 flex flex-col items-center justify-center gap-4">
        <div 
          className="w-96 h-2 bg-white/20 rounded cursor-pointer relative"
          onClick={(e) => handleSeek(e, e.currentTarget)}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}