import React, { useState, useEffect } from 'react';
import Scrollbar from '@components/ui/scrollbar';
import { useUI } from '@contexts/ui.context';
import { IoClose } from 'react-icons/io5';
import CartItem from './cart-item';
import EmptyCart from './empty-cart';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import cn from 'classnames';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import { useTranslation } from 'src/app/i18n/client';
import { useCartQuery } from '@framework/product/get-cart-product';
import axios from 'axios';

export default function Cart({ lang }: { lang: string }) {
  const limit = 35;
  const { data, refetch } = useCartQuery({ limit });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const { t } = useTranslation(lang, 'common');
  const { closeDrawer } = useUI();

  useEffect(() => {
    if (data) {
      setCartItems(data.data || []);
      setSubTotal(data.subTotal);
    }
  }, [data]);

  const handleRemoveItem = async (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    await refetch();
  };

  const handleQuantityIncrement = async (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://bepocart.in/cart/increment/${id}/`, { quantity: newQuantity }, {
        headers: { Authorization: `${token}` },
      });
      refetch(); // Refresh cart data
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const handleQuantityDecrement = async (id: string, currentQuantity: number) => {
    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://bepocart.in/cart/decrement/${id}/`, { quantity: newQuantity }, {
        headers: { Authorization: `${token}` },
      });
      refetch(); // Refresh cart data
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="relative flex items-center justify-between w-full border-b border-border-base pl-5">
        <Heading variant="titleMedium">{t('text-shopping-cart')}</Heading>
        <button className="text-2xl focus:outline-none text-brand-dark hover:opacity-60" onClick={closeDrawer}>
          <IoClose />
        </button>
      </div>
      {cartItems.length > 0 ? (
        <Scrollbar className="flex-grow w-full cart-scrollbar">
          <div className="w-full px-5 h-[calc(100vh_-_300px)]">
            {cartItems.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                lang={lang}
                onRemove={handleRemoveItem}
                onQuantityIncrement={handleQuantityIncrement}
                onQuantityDecrement={handleQuantityDecrement}
              />
            ))}
          </div>
        </Scrollbar>
      ) : (
        <EmptyCart lang={lang} />
      )}
      <div className="px-5 pt-5 pb-5 border-t border-border-base">
        <div className="flex pb-5">
          <div className="pr-3">
            <Heading className="mb-2.5">{t('text-sub-total')}:</Heading>
            <Text className="leading-6">{t('text-cart-final-price-discount')}</Text>
          </div>
          <div className="shrink-0 font-semibold text-base text-brand-dark -mt-0.5 min-w-[100px] text-right">
            ₹{subTotal}
          </div>
        </div>
        <Link
          href={cartItems.length > 0 ? `/${lang}${ROUTES.CHECKOUT}` : `/${lang}`}
          className={cn(
            'w-full px-5 py-3 flex items-center justify-center bg-heading rounded font-semibold text-sm text-brand-light bg-brand hover:bg-opacity-90',
            { 'cursor-not-allowed bg-fill-four hover:bg-fill-four': cartItems.length === 0 }
          )}
          onClick={closeDrawer}
        >
          <span>{t('text-proceed-to-checkout')}</span>
        </Link>
      </div>
    </div>
  );
}
