import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Booking Client App',
    start_url: '/',
    display: 'standalone',
    orientation: "portrait",
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    protocol_handlers: [
      {
        protocol: "web+booking",
        url: "/book/%s"
      }
    ]
  }
};
