import { useCallback } from 'react';

export function useAudioFade() {
  const fadeAudio = useCallback((audioElement: HTMLVideoElement, fadeIn: boolean, duration = 500) => {
    const startVolume = fadeIn ? 0 : 1;
    const endVolume = fadeIn ? 1 : 0;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (endVolume - startVolume) / steps;

    let currentStep = 0;
    audioElement.volume = startVolume;

    const interval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (volumeStep * currentStep);
      audioElement.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return fadeAudio;
}