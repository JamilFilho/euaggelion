import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis for rate limiting
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Create a rate limiter - 10 requests per 10 minutes
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  analytics: true,
})

// Protected routes that require authentication
const protectedRoutes = [
  '/api/manual-notify',
  '/api/tina-webhook',
]

// Allowed origins for CORS
const allowedOrigins = [
  'https://euaggelion.com.br',
  'https://admin.euaggelion.com.br',
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin') || request.headers.get('referer')

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // 1. Rate Limiting
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const { success, limit, reset, remaining } = await ratelimit.limit(`webpush_${ip}`)

    if (!success) {
      return new NextResponse(JSON.stringify({
        error: 'Too many requests',
        details: `Limit: ${limit} requests per 10 minutes`,
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      })
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Continue without rate limiting if Redis fails
  }

  // 2. CORS Validation
  if (origin && !allowedOrigins.some(allowedOrigin => 
    origin.startsWith(allowedOrigin) || origin.includes(allowedOrigin)
  )) {
    return new NextResponse(JSON.stringify({
      error: 'Origin not allowed',
      allowedOrigins: allowedOrigins.filter(origin => !origin.includes('ARVzAAIm'))
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }

// 3. Authentication - Check for API Key, Tina CMS Token, or Webhook Secret
  const authHeader = request.headers.get('Authorization')
  const webhookSecret = request.headers.get('x-webhook-secret')
  const apiKey = process.env.WEBPUSH_API_KEY || process.env.TINA_TOKEN

  // Allow requests from Tina CMS with valid token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    
    // Check if it's the Tina CMS token
    if (token === process.env.TINA_TOKEN) {
      return NextResponse.next()
    } 
    
    // Check if it's a custom API key
    if (apiKey && token === apiKey) {
      return NextResponse.next()
    }
  }

  // 4. Check for webhook secret (for Tina webhook endpoint)
  if (webhookSecret && process.env.WEBHOOK_SECRET) {
    if (webhookSecret === process.env.WEBHOOK_SECRET) {
      return NextResponse.next()
    }
  }

  // 5. For POST requests, also check if it's coming from the same site (for admin panel)
  if (request.method === 'POST') {
    const referer = request.headers.get('referer')
    if (referer && allowedOrigins.some(origin => referer.includes(origin))) {
      return NextResponse.next()
    }
  }

  // 6. Allow in development if no secret is configured (for webhook)
  if (process.env.NODE_ENV === 'development' && pathname.includes('/api/tina-webhook')) {
    console.warn('🔓 Development mode: allowing webhook without secret')
    return NextResponse.next()
  }

  // If all checks fail, return unauthorized
  return new NextResponse(JSON.stringify({
    error: 'Unauthorized',
    message: 'Authentication required for this endpoint'
  }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Bearer realm="webpush"'
    }
  })
}

export const config = {
  matcher: [
    '/api/manual-notify',
    '/api/tina-webhook',
    '/api/webmentions',
  ],
}