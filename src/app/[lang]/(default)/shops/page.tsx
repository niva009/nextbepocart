import ShopsPageContent from '@components/shops/shops-page-content';
// import PageHeroSection from '@components/ui/page-hero-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shops',
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
    <h1 className="text-5xl font-extrabold mb-6">About Us</h1>
    <p className="text-xl leading-relaxed">
      Shifting gears so I can get on your level
    </p>
  </div>
</section>

    
      <ShopsPageContent lang={lang} />
    </>
  );
}
