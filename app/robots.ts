import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/keystatic/',
    },
    sitemap: 'https://euaggelion.com.br/sitemap.xml',
  }
}