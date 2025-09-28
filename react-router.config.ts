import type { Config } from '@react-router/dev/config';

import { vercelPreset } from '@vercel/react-router/vite';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Enable file-based routing by not specifying a routes config
  // React Router v7 will automatically use the app/routes directory
  presets: [vercelPreset()],
} satisfies Config;
