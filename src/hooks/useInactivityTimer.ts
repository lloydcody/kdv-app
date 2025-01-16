import { useEffect } from 'react';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useInactivityTimer(onInactive: () => void) {
  useEffect(() => {
    let timer: number;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = window.setTimeout(onInactive, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Start initial timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [onInactive]);
}