import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Velox - AI Personal Assistant',
    short_name: 'Velox',
    description:
      'Sync Google Calendar, automate your schedule, and reclaim your time.',
    start_url: '/',
    display: 'standalone', // This removes the browser address bar
    background_color: '#f5f6f7',
    theme_color: '#b591ef', // This is your Violet color
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',

        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
