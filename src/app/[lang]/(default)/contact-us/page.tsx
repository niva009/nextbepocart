import Container from '@components/ui/container';
import PageHeroSection from '@components/ui/page-hero-section';
import ContactForm from '@components/common/form/contact-form';
import ContactSupport from '@components/contact/contact-support';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
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
    <h1 className="text-5xl font-extrabold mb-6">Contact Us</h1>
  </div>
</section>
      <Container className={"mt-10"}>
        <div
            className="flex flex-wrap bg-skin-fill w-full  relative z-10 p-5 xl:p-12 ">
          <div className="w-full md:w-[53%] xl:w-[60%] md:pe-8 lg:pe-0 2xl:pe-24 lg:mb-0 mb-8">
            <ContactSupport lang={lang} />
          </div>
          <div className="w-full md:w-[47%] xl:w-[40%] pb-0.5 lg:ps-12 pt-1.5">
            <ContactForm lang={lang} />
          </div>
        </div>

      </Container>
    </>
  );
}
