import './app.css';

import type { Route } from './+types/root';

import { AuthStateSync } from '@/components/auth/auth-state-sync';
import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/sonner';
import { getUserById } from '@/queries/users';
import { makeSSRClient } from '@/supa-client';
import { ThemeProvider } from 'next-themes';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    const profile = await getUserById(client, user?.id);
    return { user, profile };
  }
  return { user: null, profile: null };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = loaderData.user !== null;

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      storageKey='moca-theme'
      enableSystem={false}
    >
      <AuthStateSync isInitiallyLoggedIn={isLoggedIn} />
      <Navbar
        isLoggedIn={isLoggedIn}
        username={loaderData.profile?.username}
        profileImageUrl={loaderData.profile?.profile_image_url}
      />
      <main className='pt-14'>
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='container mx-auto p-4 pt-16'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full overflow-x-auto p-4'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
