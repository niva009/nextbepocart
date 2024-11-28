'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import PaymentSection from '@components/checkout/paymentpage';
import { useTranslation } from 'src/app/i18n/client';
import { useCartQuery } from '@framework/product/get-cart-product';

const PaymentPage: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState([]);
  const [isCouponValid, setIsCouponValid] = useState<null | boolean>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [hasOfferApplied, setHasOfferApplied] = useState(false);

  const { data } = useCartQuery({});

  useEffect(() => {
    if (data) {
      setCartItems(data.data || []);
      setSubTotal(data.subTotal);
      const offerApplied = data.data.some(item => item.has_offer === "Offer Applied");
      setHasOfferApplied(offerApplied);
    }
  }, [data]);

  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const response = await axios.get('http://72.167.55.172:8000/cupons/');
        setCouponData(response.data);
      } catch (error) {
        console.error("Error fetching coupon data:", error);
      }
    };
    fetchCouponData();
  }, []);

  const validateCouponCode = () => {
    setCouponError('');
    setCouponDiscount(0);

    if (couponCode !== "") {
      const appliedCoupon = couponData.find(
        (coupon) => coupon.code === couponCode && coupon.status === "Active"
      );

      if (appliedCoupon) {
        setIsCouponValid(true);
        let discountAmount = 0;

        if (appliedCoupon.discount_product.length > 0) {
          cartItems.forEach((item) => {
            if (appliedCoupon.discount_product.includes(item.product)) {
              discountAmount += appliedCoupon.coupon_type === "Percentage"
                ? (item.salePrice * parseFloat(appliedCoupon.discount)) / 100
                : Math.min(parseFloat(appliedCoupon.discount), item.salePrice);
            }
          });
        } else if (appliedCoupon.discount_category.length > 0) {
          cartItems.forEach((item) => {
            if (appliedCoupon.discount_category.includes(item.category)) {
              discountAmount += appliedCoupon.coupon_type === "Percentage"
                ? (item.salePrice * parseFloat(appliedCoupon.discount)) / 100
                : Math.min(parseFloat(appliedCoupon.discount), item.salePrice);
            }
          });
        } else {
          discountAmount = appliedCoupon.coupon_type === "Percentage"
            ? (subTotal * parseFloat(appliedCoupon.discount)) / 100
            : Math.min(parseFloat(appliedCoupon.discount), subTotal);
        }

        setCouponDiscount(discountAmount);
      } else {
        setIsCouponValid(false);
        setCouponError("Coupon not applicable to any products in the cart or expired.");
      }
    } else {
      setCouponError("Please enter a coupon code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full">
        
        {/* Coupon Details Section */}
        <div className="lg:col-span-7 p-6 bg-white rounded shadow">
          <Heading>{t('text-coupon-details')}</Heading>
          <div className="flex flex-col mt-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="border border-border-base rounded p-3 mb-4 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              disabled={hasOfferApplied || isCouponValid === true}
            />
            <Button
              onClick={validateCouponCode}
              variant="formButton"
              className="px-4 py-2 text-sm font-semibold rounded bg-brand text-brand-light"
              disabled={hasOfferApplied || isCouponValid === true}
            >
              Apply Coupon
            </Button>
            {hasOfferApplied && (
              <p className="mt-2 text-yellow-600">
                Coupon codes cannot be applied to products with an active offer. Please enjoy the current discount!
              </p>
            )}
            {isCouponValid && (
              <p className="mt-2 text-green-600">Coupon applied successfully</p>
            )}
            {isCouponValid === false && !hasOfferApplied && (
              <p className="mt-2 text-red-600">{couponError || "Coupon not valid"}</p>
            )}
            {couponDiscount > 0 && (
              <p className="mt-4 text-green-500">Discount amount: ₹ {couponDiscount.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Checkout Card Section */}
        <div className="lg:col-span-5 p-6 bg-white rounded shadow">
          <PaymentSection lang={lang} couponDiscount={couponDiscount} couponCode={couponCode} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
