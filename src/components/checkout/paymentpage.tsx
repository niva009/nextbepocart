'use client';

import { useState, useEffect } from 'react';
import { useCartQuery } from '@framework/product/get-cart-product';
import Button from '@components/ui/button';
import Text from '@components/ui/text';
import { CheckoutItem } from '@components/checkout/checkout-card-item';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useTranslation } from 'src/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import Link from 'next/link';
import axios from 'axios';

interface CheckoutCardProps {
  lang: string;
  couponDiscount: number;
  couponCode: string;
}

const PaymentSection: React.FC<CheckoutCardProps> = ({ lang, couponDiscount, couponCode }) => {
  const { t } = useTranslation(lang, 'common');
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [shipping, setShipping] = useState(0);
  const [codCharge, setCodCharge] = useState(0);
  const [addressId, setAddressId] = useState<string | null>(null);
  const COD_CHARGE = 40;
  const { data } = useCartQuery({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (data) {
      setCartItems(data.data || []);
      setSubTotal(data.subTotal);
      calculateShipping(data.subTotal);
    }
  }, [data]);

  useEffect(() => {
    // Fetch address ID from localStorage when the component mounts
    const storedAddressId = localStorage.getItem('addressid');
    setAddressId(storedAddressId);
  }, []);

  const totalAmount = subTotal - couponDiscount + shipping + codCharge;

  const checkoutFooter = [
    { id: 1, name: t('text-sub-total'), price: `₹${subTotal.toFixed(2)}` },
    { id: 2, name: t('text-shipping'), price: `₹${shipping.toFixed(2)}` },
    paymentMethod === 'COD' ? { id: 3, name: 'COD Charge', price: `₹${COD_CHARGE}` } : null,
    { id: 4, name: t('text-total'), price: `₹${totalAmount.toFixed(2)}` },
  ].filter(Boolean);

  const calculateShipping = (subTotal: number) => {
    const newShipping = subTotal < 500 ? 60 : 0;
    setShipping(newShipping);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setCodCharge(method === 'COD' ? COD_CHARGE : 0);
  };

  const handlePlaceOrder = async () => {
    if (!addressId) {
      alert('Please select an address before placing the order.');
      return;
    }

    if (paymentMethod === 'COD') {
      try {
        const res = await axios.post(
          `https://bepocart.in/order/create/${addressId}/`,
          {
            payment_method: paymentMethod,
            coupon_code: couponCode,
          },
          {
            headers: {
              Authorization: `${token}`,
            }
          }
        );
        router.push('/en/complete-order');
      } catch (error) {
        console.error('Error creating COD order:', error);
        alert('Order creation failed.');
      }
    } else {
      console.log('User selected Razorpay');
    }
  };

  return (
    <>
      <div className="px-4 pt-4 border rounded-md border-border-base text-brand-light xl:py-6 xl:px-7 bg-white rounded">
        <div className="flex pb-2 text-sm font-semibold rounded-md text-heading">
          <span className="font-medium text-15px text-brand-dark">
            {t('text-product')}
          </span>
          <span className="font-medium ltr:ml-auto rtl:mr-auto shrink-0 text-15px text-brand-dark">
            {t('text-sub-total')}
          </span>
        </div>
        
        {cartItems.length > 0 ? (
          cartItems.map((item) => <CheckoutItem item={item} key={item.id} />)
        ) : (
          <p className="py-4 text-brand-danger text-opacity-70">
            {t('text-empty-cart')}
          </p>
        )}

        {checkoutFooter.map((item) => (
          <CheckoutCardFooterItem item={item} key={item.id} />
        ))}

        <div className="mt-6">
          <p className="text-lg font-medium text-qblack mb-3">Payment Method</p>
          <div className="flex space-x-3 items-center">
            <input
              type="radio"
              id="cashOnDelivery"
              name="paymentMethod"
              className="text-accent-pink-500"
              onChange={() => handlePaymentMethodChange('COD')}
            />
            <label htmlFor="cashOnDelivery" style={{ color: 'black' }}>
              Cash on Delivery
            </label>
          </div>
          <div className="flex space-x-3 items-center mt-2">
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              className="text-accent-pink-500"
              onChange={() => handlePaymentMethodChange('NetBanking')}
            />
            <label htmlFor="creditCard" style={{ color: 'black' }}>
              Net Banking
            </label>
          </div>
        </div>

        <Button
          variant="formButton"
          className="w-full mt-8 mb-5 rounded font-semibold px-4 py-3 bg-brand text-brand-light"
          onClick={handlePlaceOrder}
          disabled={!addressId} // Disable button if addressId is not available
        >
          Place Order Now
        </Button>
      </div>

      <Text className="mt-8">
        {t('text-by-placing-your-order')}{' '}
        <Link href={`/${lang}${ROUTES.TERMS}`} className="font-medium underline text-brand">
          {t('text-terms-of-service')}
        </Link>{' '}
        {t('text-and')}{' '}
        <Link href={`/${lang}${ROUTES.PRIVACY}`} className="font-medium underline text-brand">
          {t('text-privacy')}
        </Link>
        . {t('text-credit-debit')}
      </Text>
    </>
  );
};

export default PaymentSection;
