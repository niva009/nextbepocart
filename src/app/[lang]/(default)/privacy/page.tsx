import PageHeroSection from '@components/ui/page-hero-section';
import PrivacyPageContent from './privacy-page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default async function Page({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return (
    <>
           <section className="text-center py-20 bg-gradient-to-r from-[#93ff05] to-blue-600 text-white">
  <div className="max-w-3xl mx-auto px-4">
    <h1 className="text-5xl font-extrabold mb-6"> Privacy Policy</h1>
  </div>
</section>
      <PrivacyPageContent lang={lang} />
    </>
  );
}
