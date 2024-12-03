'use client';

import { Bai_Jamjuree as FontBai } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import './[lang]/globals.css';
import '@assets/css/google-font.css';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';
import { StateProvider} from './context/usecontext'

const fontBai = FontBai({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bai',
});

const FB_PIXEL_ID = '1826070831209321'; // Replace with your actual Facebook Pixel ID
const GTM_ID = "GTM-T9NFNGB";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState(null);
  const [addresData, setAddressData] = useState(null);


  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      }
    } catch (error) {
      console.error("Error decoding JWT token:", error);
    }
  }, []);



  useEffect(() => {
    if (userData) {
      const token = localStorage.getItem("token");

      fetch('https://bepocart.in/get-address/', {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {

          // Extract the first address object
          const firstAddress = data?.address ? data?.address[0] : null; // Safe check

          if (firstAddress) {
            setAddressData(firstAddress); // Set address data
          }
        })
        .catch((error) => {
          console.error("Error fetching address data:", error);
        });
    }
  }, [userData,]);

// console.log("88888888", addresData);

  useEffect(() => {
    if (userData && window.fbq) {
      window.fbq('init', `${FB_PIXEL_ID}`, {
        em: userData.email || '', // Email
        fn: userData.name?.split(' ')[0] || '', // First Name
        ln: userData.name?.split(' ')[1] || '', // Last Name
        ph: userData.phone || '', // Phone
        external_id: userData.id || '', // User ID
        country: 'IN', // Country Code
        city:addresData?.city,
        state:addresData?.state,
        pincode:addresData?.pincode,
      });

      window.fbq('track', 'PageView');
    }
  }, [userData,addresData]); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontBai.variable} suppressHydrationWarning>


      <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,  
          }}
        />


        {/* Base Facebook Pixel Script */}
        <Script
          id="fb-pixel-base"
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
              fbq('init',1826070831209321 ); // Initialize base Pixel
            `,
          }}
        />

        {/* Facebook Pixel NoScript Fallback */}
        <noscript>
          
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="Facebook Pixel"
          />


        <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <StateProvider>
        {children}
        </StateProvider>


        <Analytics />
      </body>
    </html>
  );
}
