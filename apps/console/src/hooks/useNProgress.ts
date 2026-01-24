import { useNavigation, useFetchers } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

/**
 * Hook to show NProgress loading bar during route transitions
 * @param delay - Delay in ms before showing the progress bar (default: 300ms)
 */
export function useNProgress(delay: number = 300) {
  const navigation = useNavigation();
  const fetchers = useFetchers();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 400,
    });
  }, []);

  useEffect(() => {
    const fetchersIdle = fetchers.every((f) => f.state === 'idle');

    if (navigation.state === 'idle' && fetchersIdle) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (startedRef.current) {
        NProgress.done();
        startedRef.current = false;
      }
    } else {
      if (!timerRef.current && !startedRef.current) {
        timerRef.current = setTimeout(() => {
          NProgress.start();
          startedRef.current = true;
          timerRef.current = null;
        }, delay);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigation.state, fetchers, delay]);
}
