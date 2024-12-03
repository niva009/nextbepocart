// WishlistProductCard.tsx

'use client';

import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import Image from '@components/ui/image';
import { Product } from '@framework/types';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { useTranslation } from 'src/app/i18n/client';
import axios from 'axios';
import Link from 'next/link';
import { WishlistModal } from './modal-wishlist';
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';


interface ProductProps {
  product: Product;
  className?: string;
  lang: string;
}

const WishlistProductCard: FC<ProductProps> = ({ product, lang }) => {
  const { t } = useTranslation(lang, 'common');
  const { id, slug, productImage, productPrice } = product ?? {};
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const placeholderImage = `/assets/placeholder/product.svg`;
  const queryClient = useQueryClient(); // Initialize the query client


  const [favorite, setFavorite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://bepocart.in/wishlist-delete/${id}/`, {
        headers: { Authorization: `${token}` },
      });
      setFavorite(true);
      queryClient.invalidateQueries(API_ENDPOINTS.WISHLIST); // Refetch address data
    } catch (error) {
      console.error("Wishlist delete error:", error);
      setFavorite(false);
    }
  };

  const renderFavoriteIcon = (): ReactNode => (
    favorite ? (
      <>
        <IoIosHeartEmpty className="w-5 h-5 mt-0.5" />
        <span className="ltr:ml-3 rtl:mr-3 text-brand-dark font-medium text-15px -mt-0.5 md:mt-0">
          {t('text-favorite')}
        </span>
      </>
    ) : (
      <>
        <IoIosHeart className="text-brand w-5 h-5 mt-0.5" />
        <span className="text-brand ltr:ml-3 rtl:mr-3 font-semibold text-15px -mt-0.5 md:mt-0">
          {t('text-favorited')}
        </span>
      </>
    )
  );

  return (
    <div className="flex flex-col py-4 border-b md:flex-row border-border-base wishlist-card last:pb-0 first:-mt-8 lg:first:-mt-4">
      <div className="flex">
        <div className="relative mt-1 shrink-0">
          <div className="flex overflow-hidden max-w-[80px] transition duration-200 ease-in-out transform group-hover:scale-105">
            <Link href={`/en/products/${slug}`}>
              <Image
                src={`https://bepocart.in/${productImage }`}
                alt={slug || 'Product Image'}
                width={80}
                height={80}
                quality={100}
                className="object-cover bg-fill-thumbnail"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col ltr:ml-2 rtl:mr-2 h-full">
          <Link href={`/en/products/${slug}`}>
            <h2 className="text-brand-dark text-20px sm:text-30px lg:text-35px leading-5 sm:leading-6 mb-1.5">
              {slug}
            </h2>
          </Link>
          <div>
            <span className="text-sm font-semibold sm:text-25px lg:text-base text-brand-dark">
              ₹ {productPrice}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center ltr:ml-auto rtl:mr-auto md:pt-7 space-x-4">
        <div
          className="flex cursor-pointer"
          onClick={() => {
            setFavorite(!favorite);
            handleDelete(id);
          }}
        >
          {renderFavoriteIcon()}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent hover:bg-qh3-blue text-blue-700 font-semibold hover:text-black py-2 px-2 md:px-4 border border-blue-500 hover:border-transparent rounded text-[13px] md:text-[15px]"
        >
          Add to Cart
        </button>
      </div>
      {isModalOpen && (
        <WishlistModal slug={slug} deleteItem ={() => handleDelete(id)} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default WishlistProductCard;
