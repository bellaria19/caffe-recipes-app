import { browserClient } from '@/supa-client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface AuthStateSyncProps {
  isInitiallyLoggedIn: boolean;
}

export function AuthStateSync({ isInitiallyLoggedIn }: AuthStateSyncProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = browserClient.auth.onAuthStateChange((event, session) => {
      // If user was initially logged in but session is now null, they've been logged out
      if (isInitiallyLoggedIn && event === 'SIGNED_OUT') {
        // Show logout notification
        toast.info('로그아웃되었습니다', {
          description: '세션이 만료되어 자동으로 로그아웃되었습니다.',
          duration: 3000,
        });

        // Small delay to allow toast to show before navigation
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 500);
      }

      // If user was initially logged out but now has a session, they've logged in
      if (!isInitiallyLoggedIn && event === 'SIGNED_IN' && session) {
        // Refresh to update UI state
        window.location.reload();
      }

      // Handle token refresh failures which might indicate an invalid session
      if (event === 'TOKEN_REFRESHED' && !session) {
        // Show logout notification for token refresh failure
        toast.warning('인증이 만료되었습니다', {
          description: '다시 로그인해주세요.',
          duration: 3000,
        });

        // Session is invalid, redirect to login
        setTimeout(() => {
          navigate('/auth/login');
          window.location.reload();
        }, 500);
      }
    });

    // Periodically check auth state to catch cases where token has expired
    const checkAuthState = async () => {
      try {
        const { data: { user }, error } = await browserClient.auth.getUser();

        // If we think user is logged in but getUser returns no user or error
        if (isInitiallyLoggedIn && (!user || error)) {
          console.warn('Auth state mismatch detected, logging out...', error);

          // Show logout notification for auth state mismatch
          toast.info('로그아웃되었습니다', {
            description: '인증 상태가 변경되어 자동으로 로그아웃되었습니다.',
            duration: 3000,
          });

          setTimeout(() => {
            navigate('/');
            window.location.reload();
          }, 500);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        if (isInitiallyLoggedIn) {
          // Show logout notification for auth check error
          toast.error('연결 오류', {
            description: '서버와 연결에 문제가 발생하여 로그아웃됩니다.',
            duration: 3000,
          });

          setTimeout(() => {
            navigate('/');
            window.location.reload();
          }, 500);
        }
      }
    };

    // Check auth state every 30 seconds
    const interval = setInterval(checkAuthState, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [isInitiallyLoggedIn, navigate]);

  return null; // This component doesn't render anything
}