'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'src/app/i18n/client';
import { usePopularProductsQuery } from '@framework/product/get-all-popular-products';
import { LIMITS } from '@framework/utils/limits';
import { ROUTES } from '@utils/routes';
import SectionHeader from '@components/common/section-header';
import Alert from '@components/ui/alert';
import Image from '@components/ui/image';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from '@components/ui/carousel/slider';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import ProductFlashSellCard from '@components/product/product-cards/product-flash-sell-card';
import ClockIcon from '@components/icons/clock-icon';

interface ProductFeedProps {
  lang: string;
  className?: string;
  uniqueKey?: string;
}

const breakpoints = {
  '1280': { slidesPerView: 4 },
  '1024': { slidesPerView: 4 },
  '640': { slidesPerView: 3 },
  '0': { slidesPerView: 2 },
};

const backgroundThumbnail = '/assets/images/banner/home1/hotdeals.png';

const ProductWithBestDeals: React.FC<ProductFeedProps> = ({
  lang,
  className = '',
  uniqueKey,
}) => {
  const limit = LIMITS.POPULAR_PRODUCTS_TWO_LIMITS;
  const { t } = useTranslation(lang, 'common');
  const { data, isLoading, error } = usePopularProductsQuery({ limit });

  const now = new Date();
  const tomorrowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );

  return (
    <div className={`mb-12 lg:mb-14 ${className}`}>
      {/* Header Section */}
      <div className="md:flex justify-between mb-1.5 px-5 py-2.5 rounded bg-white">
        <div className="flex items-center gap-2">
          <ClockIcon opacity="1" />
          <SectionHeader
            lang={lang}
            headingPosition="hotdeal"
            sectionHeading="text-deals-of-the-week"
            sectionSubHeading="text-deals-subheading"
            className="flex gap-2 items-center uppercase"
          />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-skin-base text-red-600 font-bold text-[14px]">
            {t('text-offer-end')}
          </h2>
        </div>
      </div>

      {/* Product Section */}
      {error ? (
        <Alert message={error?.message} className="col-span-full" />
      ) : (
        <div className="xl:flex gap-1 relative heightFull">
          {/* Background Thumbnail */}
          <div className="xl:max-w-[466px] relative overflow-hidden flex items-center">
            <Link href={`/${lang}${ROUTES.SEARCH}?category=bicycle-water-bottle`}>
              <Image
                src={backgroundThumbnail}
                alt="Product Image"
                width={465}
                height={395}
              />
            </Link>
          </div>

          {/* Carousel Content */}
          <div className="trendy-main-content">
            <Carousel breakpoints={breakpoints} spaceBetween={6}>
              {isLoading && !data?.length
                ? Array.from({ length: limit }).map((_, idx) => (
                    <SwiperSlide
                      key={`bestdeals-${idx}`}
                      className="p-2 w-60 h-full rounded bg-white"
                    >
                      <ProductCardLoader
                        key={`bestdeals-${idx}`}
                        uniqueKey={`bestdeals-${idx}`}
                      />
                    </SwiperSlide>
                  ))
                : data?.slice(0, limit).map((product: any, idx) => (
                    <SwiperSlide key={`${uniqueKey}-${idx}`}>
                      <ProductFlashSellCard
                        lang={lang}
                        key={`popular-product-${product.id}`}
                        product={product}
                        date={tomorrowMidnight.getTime()}
                        href={`/${lang}${ROUTES.PRODUCTS}/${product.slug}`} // Pass href here
                      />
                    </SwiperSlide>
                  ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductWithBestDeals;
