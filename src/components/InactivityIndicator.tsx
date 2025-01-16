import React, { useEffect, useRef } from 'react';

interface Props {
  timeoutDuration: number;
}

export function InactivityIndicator({ timeoutDuration }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const updateTimer = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate progress
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const progress = Math.min(elapsed / timeoutDuration, 1);

      // Draw background circle
      ctx.beginPath();
      ctx.arc(8, 8, 7, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();

      // Draw progress arc
      ctx.beginPath();
      ctx.arc(8, 8, 7, -Math.PI / 2, (-Math.PI / 2) + (progress * 2 * Math.PI));
      ctx.lineTo(8, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    };

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Start animation loop
    const animationFrame = setInterval(updateTimer, 1000 / 30); // 30 FPS

    return () => {
      clearInterval(animationFrame);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [timeoutDuration]);

  return (
    <canvas
      ref={canvasRef}
      width={16}
      height={16}
      className="fixed bottom-4 left-4 z-[1000]"
    />
  );
}