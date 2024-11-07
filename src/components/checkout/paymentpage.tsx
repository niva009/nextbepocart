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
        await axios.post(
          `https://bepocart.in/order/create/${addressId}/`,
          { payment_method: paymentMethod, coupon_code: couponCode },
          { headers: { Authorization: `${token}` } }
        );
        router.push('/en/complete-order');
      } catch (error) {
        console.error('Error creating COD order:', error);
        alert('Order creation failed.');
      }
    } else {
      displayRazorpay();
    }
  };

  async function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    if (totalAmount <= 0) {
      alert('Invalid subtotal amount.');
      return;
    }

    try {
      const initialResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/create/${addressId}/`,
        { coupon_code: couponCode, payment_method: paymentMethod },
        { headers: { Authorization: `${token}` } }
      );
      const { razorpay_order_id } = initialResponse.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: (totalAmount * 100).toString(),
        currency: 'INR',
        order_id: razorpay_order_id,
        name: 'Bepocart Pvt Limited',
        description: 'Thank you for your order',
        handler: async function (response: any) {
          const data = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            const result = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/verify-razorpay-payment/`,
              {
                order_id: razorpay_order_id,
                coupon_code: couponCode,
                payment_id: data.razorpayPaymentId,
                razorpay_signature: data.razorpaySignature,
                total_amount: totalAmount,
                address_id: addressId,
                shipping_charge: shipping,
              },
              { headers: { Authorization: ` ${token}` } }
            );

            if (result.status === 200) {
              alert('Payment successful and order created!');
              router.push('/en/complete-order');
            } else {
              alert('Failed to create order. Please try again.');
            }
          } catch (error) {
            console.log('Error processing payment:', error);
            alert('Payment was successful, but there was an issue creating the order. Please try again.');
          }
        },
        prefill: {
          name: 'name',
          email: 'email@example.com',
          contact: '1234567890',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Server error. Are you online?');
    }
  }

  return (
    <>
      <div className="px-4 pt-4 border rounded-md border-border-base text-brand-light xl:py-6 xl:px-7 bg-white rounded">
        {/* Cart Items and Footer */}
        {cartItems.length > 0 ? (
          cartItems.map((item) => <CheckoutItem item={item} key={item.id} />)
        ) : (
          <p className="py-4 text-brand-danger text-opacity-70">{t('text-empty-cart')}</p>
        )}
        {checkoutFooter.map((item) => <CheckoutCardFooterItem item={item} key={item.id} />)}

        {/* Payment Method */}
        <div className="mt-6">
          <p className="text-lg font-medium text-qblack mb-3">Payment Method</p>
          <div className="flex space-x-3 items-center">
            <input type="radio" id="cashOnDelivery" name="paymentMethod" onChange={() => handlePaymentMethodChange('COD')} />
            <label htmlFor="cashOnDelivery" style={{ color: 'black' }}>Cash on Delivery</label>
          </div>
          <div className="flex space-x-3 items-center mt-2">
            <input type="radio" id="razorpay" name="paymentMethod" onChange={() => handlePaymentMethodChange('razorpay')} />
            <label htmlFor="razorpay" style={{ color: 'black' }}>Razorpay</label>
          </div>
        </div>

        <Button variant="formButton" className="w-full mt-8 mb-5 rounded font-semibold px-4 py-3 bg-brand text-brand-light" onClick={handlePlaceOrder} disabled={!addressId}>
          Place Order Now
        </Button>
      </div>

      <Text className="mt-8">
        {t('text-by-placing-your-order')}{' '}
        <Link href={`/${lang}${ROUTES.TERMS}`} className="font-medium underline text-brand">{t('text-terms-of-service')}</Link>{' '}
        {t('text-and')}{' '}
        <Link href={`/${lang}${ROUTES.PRIVACY}`} className="font-medium underline text-brand">{t('text-privacy')}</Link>.
      </Text>
    </>
  );
};

export default PaymentSection;
