import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zdn.mn'
  
  return {
    name: 'ZDN Smart Energy - Газрын тосны лаборатори, тооны хяналт',
    short_name: 'ZDN Smart Energy',
    description: 'MNS ISO/IEC 17025:2018 стандартаар итгэмжлэгдсэн газрын тосны лаборатори, тооны хяналтын алба',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/zdn-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

