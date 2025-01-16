import { useEffect } from 'react';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export function useInactivityTimer(onInactive: () => void) {
  useEffect(() => {
    let timer: number;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = window.setTimeout(onInactive, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [onInactive]);
}