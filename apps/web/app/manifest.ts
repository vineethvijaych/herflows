import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HerFlows — Personalized Period Wellness',
    short_name: 'HerFlows',
    description: 'Your personalized monthly period-care kit',
    start_url: '/',
    display: 'standalone',
    background_color: '#fefcf8',
    theme_color: '#c92f52',
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
  };
}
