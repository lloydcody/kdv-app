import { useState, useEffect } from 'react';

export function useCarouselTimer(displayDuration: number, onTransitionComplete: () => void) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const displayTimer = setInterval(() => {
      setIsTransitioning(true);
    }, displayDuration);

    const transitionTimer = setInterval(() => {
      if (isTransitioning) {
        onTransitionComplete();
        setIsTransitioning(false);
      }
    }, 1000);

    return () => {
      clearInterval(displayTimer);
      clearInterval(transitionTimer);
    };
  }, [displayDuration, onTransitionComplete, isTransitioning]);

  return { isTransitioning };
}