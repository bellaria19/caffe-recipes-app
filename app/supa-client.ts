import type { Database } from 'database.types';

import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

// Get environment variables with fallbacks
const supabaseUrl =
  process.env.SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://yacgsjapwfldwzbqejqf.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhY2dzamFwd2ZsZHd6YnFlanFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjcxMTksImV4cCI6MjA3MjQwMzExOX0.e885_UY_CAmG1it6xHnhkMMbguysJ7Kb-WUp9vIDzVs';

export const browserClient = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();

  const serverSideClient = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          const cookies = parseCookieHeader(
            request.headers.get('Cookie') ?? ''
          );
          // value가 undefined인 경우 빈 문자열로 변환
          return cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value ?? '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );

  return { client: serverSideClient, headers };
};
