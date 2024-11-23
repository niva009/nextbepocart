import { NextResponse } from 'next/server';

export async function GET() {
  // Define the content for your robots.txt
  const robotsContent = `
    User-agent: *
    Allow: '/en',
    Disallow:'/en/my-account/'
    Disallow:'/en/checkout'
    Disallow:'/en/payment'  
    Disallow:'/en/order-success'
    Disallow:'/en/signin'
    Disallow:'/en/signup'
    Disallow:'/en/search'
    
    Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bepocart.com/en'}/sitemap.xml
  `;

  // Return the content as plain text
  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
