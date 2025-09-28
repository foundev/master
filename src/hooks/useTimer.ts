import { useState, useEffect } from 'react';

export const useTimer = (isActive: boolean, startTime?: number) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const elapsed = isActive && startTime ? currentTime - startTime : 0;

  return elapsed;
};