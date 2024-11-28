'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import ProductCardAlpine from '@components/product/product-cards/product-card';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import { Product } from '@framework/types';
import { useTranslation } from 'src/app/i18n/client';

interface ProductGridProps {
  lang: string;
  slug: string;
  className?: string;
}

export const ProductGrid: FC<ProductGridProps> = ({ className = '', lang, slug }) => {
  const { t } = useTranslation(lang, 'common');
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://72.167.55.172:8000/subcategory/${slug}/`, {
          params: { page },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const products = response.data.products || [];
        const nextPageExists = !!response.data.nextPage;

        setData((prevData) => [...prevData, ...products]);
        setHasNextPage(nextPageExists);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [slug, page]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
        {error ? (
          <div className="col-span-full">
            <Alert message={error} />
          </div>
        ) : isLoading && !data.length ? (
          Array.from({ length: 12 }).map((_, idx) => (
            <ProductCardLoader key={`product-loader-${idx}`} uniqueKey={`product-loader-${idx}`} />
          ))
        ) : (
          data.map((product: Product, index) => (
            <ProductCardAlpine
              key={`product--key-${product.id}-${index}`} // Ensure unique keys
              product={product}
              lang={lang}
            />
          ))
        )}
      </div>
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleLoadMore}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            className="w-60"
          >
            {t('button-load-more')}
          </Button>
        </div>
      )}
    </>
  );
};
