import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useTimer = (isActive: boolean, startTime?: number, goalId?: string) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isActive) {
      // clear stored active session when timer not active (if API exists)
      if (goalId && typeof storage.saveActiveSession === 'function') {
        storage.saveActiveSession(null);
      }
      return;
    }

    const start = startTime ?? Date.now();
    // initial persist (only if storage helper is available)
    const hasSaveActive = typeof storage.saveActiveSession === 'function';
    if (goalId && hasSaveActive) {
      storage.saveActiveSession({ goalId, startTime: start, lastUpdated: Date.now() });
    }

    // persist on visibility change / unload so we don't lose the latest timestamp
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && goalId && hasSaveActive) {
        try {
          storage.saveActiveSession({ goalId, startTime: start, lastUpdated: Date.now() });
        } catch (e) {
          // swallow errors during unload
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (goalId && hasSaveActive) {
        try {
          // localStorage is synchronous and available in most browsers during unload
          storage.saveActiveSession({ goalId, startTime: start, lastUpdated: Date.now() });
        } catch (e) {
          // ignore
        }
      }
    };

    if (hasSaveActive) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    const tick = () => {
      setCurrentTime(Date.now());
    };

    // update UI every second
    const uiInterval = setInterval(tick, 1000);
    // persist every 10 seconds (only if API exists)
    let persistInterval: ReturnType<typeof setInterval> | null = null;
    if (goalId && hasSaveActive) {
      persistInterval = setInterval(() => {
        storage.saveActiveSession({ goalId, startTime: start, lastUpdated: Date.now() });
      }, 10_000);
    }

    return () => {
      clearInterval(uiInterval);
      if (persistInterval) clearInterval(persistInterval);
      if (hasSaveActive) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      // optionally leave the active session persisted until stop; or clear it here:
      // if (goalId) storage.saveActiveSession(null);
    };
  }, [isActive, startTime, goalId]);

  const elapsed = isActive && startTime ? currentTime - startTime : 0;

  return elapsed;
};