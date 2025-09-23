import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook to periodically validate token expiration
 * Checks every 30 seconds if the user is authenticated
 */
export const useTokenValidation = () => {
  const { isAuthenticated, checkTokenExpiration } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token expiration every 30 seconds
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // 60 seconds

    // Also check on window focus (when user comes back to the app)
    const handleFocus = () => {
      checkTokenExpiration();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, checkTokenExpiration]);
};
