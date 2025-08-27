import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // For now, return a simple response until you add the actual favicon.ico file
  // This prevents the generateStaticParams error
  return new Response(null, {
    status: 404,
    headers: {
      'Content-Type': 'image/x-icon',
    },
  })
}
