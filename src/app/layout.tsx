'use client';

import { Bai_Jamjuree as FontBai } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';
import './[lang]/globals.css';
import '@assets/css/google-font.css';

const fontBai = FontBai({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bai',
});

const FB_PIXEL_ID = '1826070831209321'; // Replace with your actual Facebook Pixel ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontBai.variable} suppressHydrationWarning>
        {/* Facebook Pixel Script */}
        <Script
  id="fb-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `,
  }}
/>


<link
  rel="preload"
  href="https://www.facebook.com/tr?id=1826070831209321&ev=PageView&noscript=1"
  as="image"
  type="image/gif"
/>



        {/* Facebook Pixel NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* Main Content */}
        {children}

        <Analytics />
        {/* <SpeedInsights /> */}

      </body>
    </html>
  );
}
