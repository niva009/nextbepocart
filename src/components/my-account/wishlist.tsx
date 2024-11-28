'use client';

import ProductWishlistGrid from '@components/product/wishlist-product';
import { tokenAuth } from 'src/hooks/tokenauth';

export default function Wishlist({ lang }: { lang: string }) {
  tokenAuth()
  return (
    <div className="flex flex-col pt-8 2xl:pt-12">
      <ProductWishlistGrid lang={lang} />
    </div>
  );
}
