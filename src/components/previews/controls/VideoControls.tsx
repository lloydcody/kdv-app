import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>, seekBar: HTMLDivElement) => void;
}

export function VideoControls({
  isPlaying,
  isMuted,
  progress,
  onPlayPause,
  onMuteToggle,
  onSeek
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className="w-96 h-2 bg-white/20 rounded cursor-pointer relative"
        onClick={(e) => onSeek(e, e.currentTarget)}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-white rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={onMuteToggle}
          className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}