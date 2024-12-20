'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import SearchTopBar from '@components/search/search-top-bar';
import Container from '@components/ui/container';
import { Element } from 'react-scroll';
import Breadcrumb from '@components/ui/breadcrumb';
import { ProductGrid } from '../page';

export default function MainCategoryPage() {
  const { lang, slug } = useParams();
  const [viewAs, setViewAs] = useState(true);

  if (!slug) {
    return (
      <Container>
        <div className="pt-10">
          <Breadcrumb lang={lang || 'en'} />
        </div>
        <div className="py-10 text-center text-red-500">
          Error: Subcategory not found!
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <div className="pt-10">
        <Breadcrumb lang={lang || 'en'} />
      </div>
      <Element
        name="grid"
        className="flex pt-7 lg:pt-7 pb-10 lg:pb-16 products-category"
      >
        <div className="sticky hidden h-full shrink-0 ltr:pr-7 rtl:pl-7 lg:block w-[300px] top-16">
          {/* Add filters if needed */}
        </div>
        <div className="w-full">
          <SearchTopBar
            lang={lang || 'en'}
            viewAs={viewAs}
            onNavClick={(newViewAs) => setViewAs(newViewAs)}
          />
          <ProductGrid lang={lang || 'en'} slug={slug} className="mt-4" />
        </div>
      </Element>
    </Container>
  );
}
