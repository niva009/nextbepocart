'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import SearchTopBar from '@components/search/search-top-bar';
import Container from '@components/ui/container';
import { Element } from 'react-scroll';
import Breadcrumb from '@components/ui/breadcrumb';
import SubProduct from './[slug]/page';

export default function MainCategory({ lang }: { lang: string }) {
  const { slug } = useParams(); // Extract `slug` dynamically from the URL
  const [viewAs, setViewAs] = useState(true);

  if (!slug) {
    return <div>Error: Subcategory not found!</div>;
  }

  return (
    <Container>
      <div className="pt-10">
        <Breadcrumb lang={lang} />
      </div>
      <Element
        name="grid"
        className="flex pt-7 lg:pt-7 pb-10 lg:pb-16 products-category"
      >
        <div className="sticky hidden h-full shrink-0 ltr:pr-7 rtl:pl-7 lg:block w-[300px] top-16">
          {/* ShopFilters can be enabled here if required */}
        </div>
        <div className="w-full">
          <SearchTopBar lang={lang} viewAs={viewAs} onNavClick={setViewAs} />
          {/* Pass `slug` dynamically */}
          <SubProduct lang={lang} slug={slug} viewAs={viewAs} />
        </div>
      </Element>
    </Container>
  );
}
