import ManagedModal from '@components/common/modal/managed-modal';
import { ManagedUIContext } from '@contexts/ui.context';
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import ManagedDrawer from '@components/common/drawer/managed-drawer';
import { Metadata } from 'next';
import ToasterProvider from 'src/app/provider/toaster-provider';
import Providers from 'src/app/provider/provider';
import { Bai_Jamjuree as FontBai } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google OAuth Provider
// external
import 'react-toastify/dist/ReactToastify.css';

// base css file
import '@assets/css/scrollbar.css';
import '@assets/css/swiper-carousel.css';
import '@assets/css/custom-plugins.css';
import '@assets/css/rc-drawer.css';
import '@assets/css/themes.scss';
import '@assets/css/google-font.css';
import './globals.css';

const fontBai = FontBai({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bai',
});

export const metadata: Metadata = {
  title: {
    template: 'bepocart | %s',
    default: 'Bepocart, an ecommerce website for a wide range of cycles, accessories, and apparel in India',
  },
};

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = params; // Destructure `lang` inside the function body

  return (
    <html lang={lang} dir={dir(lang)}>
      <body className={fontBai.variable}>
        {/* Wrap the application with GoogleOAuthProvider */}
        <GoogleOAuthProvider clientId={process.env.NEXT_GOOGLE_CLIENT_ID!}>
          <Providers>
            <ManagedUIContext>
              {children}
              <ManagedModal lang={lang} />
              <ManagedDrawer lang={lang} />
              <ToasterProvider />
            </ManagedUIContext>
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
