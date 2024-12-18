'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import ProductCardAlpine from '@components/product/product-cards/product-card';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import ProductCardList from '@components/product/product-cards/product-list-view';
import { useProductsQuery } from '@framework/product/get-all-products';
import { Product } from '@framework/types';
import { useTranslation } from 'src/app/i18n/client';

interface ProductGridProps {
  lang: string;
  className?: string;
  viewAs: boolean;
}

export const ProductGrid: FC<ProductGridProps> = ({ className = '', lang, viewAs }) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract query parameters dynamically
  const queryParams = Object.fromEntries(searchParams.entries());

  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery(queryParams); // Dynamically pass queryParams

  return (
    <>
      <div
        className={`${
          viewAs
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5'
            : 'grid grid-cols-1 gap-1.5'
        } ${className}`}
      >
        {error ? (
          <div className="col-span-full">
            <Alert message={error?.message} />
          </div>
        ) : isLoading && !data?.pages?.length ? (
          Array.from({ length: 30 }).map((_, idx) => (
            <ProductCardLoader
              key={`product--key-${idx}`}
              uniqueKey={`product--key-${idx}`}
            />
          ))
        ) : (
          data?.pages?.map((page: any) => {
            if (viewAs) {
              return page?.data?.map((product: Product) => (
                <ProductCardAlpine
                  key={`product--key-${product.id}`}
                  product={product}
                  lang={lang}
                />
              ));
            } else {
              return page?.data?.map((product: Product) => (
                <ProductCardList
                  key={`product--key-${product.id}`}
                  product={product}
                  lang={lang}
                />
              ));
            }
          })
        )}
      </div>
      {hasNextPage && (
        <div className="mt-1.5 py-5 text-center bg-white rounded">
          <Button
            loading={loadingMore}
            disabled={loadingMore}
            onClick={() => fetchNextPage()}
            className={'w-60 '}
            variant={'primary'}
          >
            {t('button-load-more')}
          </Button>
        </div>
      )}
    </>
  );
};
