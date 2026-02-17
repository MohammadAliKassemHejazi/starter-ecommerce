import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from './usePermissions';
import { trackEvent as trackEventService } from '../services/analyticsService';

export const useAnalyticsTracker = () => {
  const router = useRouter();
  const { isAuthenticated } = usePermissions();

  const trackEvent = useCallback((eventType: string, eventData: any = {}) => {
    if (isAuthenticated) {
      // Add timestamp if not present? Backend adds createdAt.
      trackEventService(eventType, eventData).catch((err) => {
        // Silently fail or log to console
        console.error('Analytics tracking failed:', err);
      });
    }
  }, [isAuthenticated]);

  // Track initial page load or when auth state changes to true
  useEffect(() => {
    if (isAuthenticated) {
      trackEvent('page_view', {
        path: router.asPath,
        title: document.title
      });
    }
    // We only want to run this when isAuthenticated becomes true or on mount if already true.
    // We do NOT want to run this on every router.asPath change because routeChangeComplete handles that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Track route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isAuthenticated) {
        // Small delay to allow document.title to update (optional but helpful)
        setTimeout(() => {
          trackEvent('page_view', {
            path: url,
            title: document.title
          });
        }, 100);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, isAuthenticated, trackEvent]);

  return { trackEvent };
};
