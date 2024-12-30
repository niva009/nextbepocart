'use client';

import { useState, useEffect } from 'react';
import cn from 'classnames';
import Image from '@components/ui/image';
import useWindowSize from '@utils/use-window-size';
import { useCart } from '@contexts/cart/cart.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { useTranslation } from 'src/app/i18n/client';
import { ROUTES } from '@utils/routes';
import Link from '@components/ui/link';
import CheckIcon from '@components/icons/check-icon';
import StarIcon from '@components/icons/star-icon';
import { ProductWishlist } from './product-wishlist';
import { productPlaceholder } from '@assets/placeholders';

interface ProductProps {
  lang: string;
  product: any;
  className?: string;
  variant: string;
}

const RenderLabelStock = ({ slug, lang }: { slug: string; lang: string }) => {
  const { t } = useTranslation(lang, 'common');
  const [stock, setStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [sizes, setSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://bepocart.in/product/${slug}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product data for slug: ${slug}`);
        }
        const productData = await response.json();

        if (productData?.product?.type === 'variant' && productData?.images?.length > 0) {
          // Handle variant product
          const firstAvailableColor = productData.images.find((image: any) =>
            image.stock_info.some((sizeInfo: any) => sizeInfo.stock > 0)
          );

          if (firstAvailableColor) {
            setSelectedColor(firstAvailableColor.color);
            setSelectedImage(firstAvailableColor);
            setSizes(firstAvailableColor.stock_info);

            const firstAvailableSize = firstAvailableColor.stock_info.find(
              (sizeInfo: any) => sizeInfo.stock > 0
            );

            if (firstAvailableSize) {
              setSelectedSize(firstAvailableSize.size);
              setStock(firstAvailableSize.stock);
              setOutOfStock(false);
            } else {
              setStock(0);
              setOutOfStock(true);
            }
          } else {
            setStock(0);
            setOutOfStock(true);
          }
        } else if (productData?.product?.type === 'single' && productData?.images?.[0]) {
          // Handle single product
          const singleProductStock = productData.images[0].stock || 0;
          setSelectedImage(productData.images[0]);
          setStock(singleProductStock);
          setOutOfStock(singleProductStock < 1);
        } else {
          // Fallback case
          setStock(0);
          setOutOfStock(true);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setStock(0);
        setOutOfStock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <p className="font-medium flex items-center space-x-1 text-[12px] text-skin-label_in loading">
        <span>{t('stock-info')}</span>
      </p>
    );
  }

  if (Number(stock) < 1 || outOfStock) {
    return (
      <p className="font-medium flex items-center space-x-1 text-[12px] text-skin-label_out out_stock">
        <CheckIcon fill="text-skin-label_in" opacity="1" />
        <span>{t('text-out-stock')}</span>
      </p>
    );
  }

  return (
    <p className="font-medium flex items-center space-x-1 text-[12px] text-skin-label_in in_stock">
      <CheckIcon fill="text-skin-label_in" opacity="1" />
      <span>{t('text-in-stock')}</span>
      <span className="text-brand-dark">
        <b>{stock}</b> {t('text-items')}
      </span>
    </p>
  );
};

const ProductCard: React.FC<ProductProps> = ({ product, className, lang, variant = 'default' }) => {
  const { id, name, image, slug, salePrice, price, discount } = product ?? {};
  const { width } = useWindowSize();
  const { isInCart, isInStock } = useCart();
  const outOfStock = isInCart(id) && !isInStock(id);
  const iconSize = width! > 1024 ? '20' : '17';

  return (
    <div>
      <a href={`/${lang}${ROUTES.PRODUCTS}/${slug}`}className="block">
    <article
      className={cn(
        'flex flex-col gap-2 product-card relative p-2 sm:p-4 h-full bg-white',
        className,
        outOfStock ? 'card-image--nojump' : 'card-image--jump',
        {
          'hover:shadow-navigation hover:z-50': variant === 'outBorder' || variant === 'noHeading',
          'rounded': variant === 'default',
        }
      )}
      title={name}
    >
      <div className="relative flex-shrink-0">
        <div className="relative card-img-container overflow-hidden flex item-center w-full">
          <Link
            href={`/${lang}${ROUTES.PRODUCTS}/${slug}`}
            className="text-skin-base font-semibold text-sm leading-5 min-h-[40px] line-clamp-2 mt-1 mb-2 hover:text-brand"
          >
            <img
              src={`https://bepocart.in/${image}`}
              alt={name || 'Product Image'}
              width={180}
              height={180}
            />
          </Link>
        </div>
        <div className="w-full h-full absolute top-0 z-10 -mx-0.5 md:-mx-1">
          <span className="text-[15px] font-large text-skin-inverted uppercase inline-block bg-green-600 rounded-sm font-bold px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
            {Math.floor(discount)}% off
          </span>
        </div>
      </div>

      <div className="flex flex-col h-full overflow-hidden relative product-cart-content">
        <Link
          href={`/${lang}${ROUTES.PRODUCTS}/${slug}`}
          className="text-skin-base font-semibold text-sm leading-5 min-h-[40px] line-clamp-2 mt-1 mb-2 hover:text-brand"
        >
          {name}
        </Link>
        <div className="flex text-gray-500">
          <div className="flex items-center">
            {[...Array(5)].map((_, idx) => (
              <StarIcon
                key={idx}
                color={idx < 5 ? '#F3B81F' : '#DFE6ED'}
                className="w-3 h-3 mx-px"
              />
            ))}
          </div>
          <span className="text-[13px] leading-4">(1 review)</span>
        </div>
        <div className="space-s-2">
          <span className="inline-block font-semibold text-[18px] text-brand">
            ₹{salePrice}
          </span>
          {price && (
            <del className="mx-1 text-black-400 text-opacity-70">₹{price}</del>
          )}
        </div>
        <div className="mt-3">
          <RenderLabelStock slug={slug} lang={lang} />
        </div>
        <div className="block product-cart-button font-semibold">
          <ProductWishlist id={id} product={product} />
        </div>
      </div>
    </article>
    </a>
    </div>
  );
};

export default ProductCard;
