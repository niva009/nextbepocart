'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSuccess() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);


  console.log("order dataaa" , orderData);

  // Load order data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('orderData');
      if (savedData) {
        setOrderData(JSON.parse(savedData));
      }
    }
  }, []);

  // Facebook Pixel Tracking for Purchase
  useEffect(() => {
    if (orderData) {
      fbq('track', 'Purchase', {
        item_id: orderData?.content_ids,
        contents: orderData?.contents,
        affiliation: 'bepocart',
        payment_method: orderData?.payment_method, // Ensure this exists in the data
        coupon_code: orderData?.coupon_code,
        currency: "INR",
        transaction_id: orderData?.transaction_id,
        item_brand: "bepocart",
        customer_segment: orderData?.customer_segment,
        value: orderData?.value,
      });
    }
  }, [orderData]);


  useEffect(() => {
    if (orderData) {
      window.dataLayer.push({
        event: "purchase", 
        item_id: orderData?.content_ids,
        items: orderData?.contents,
        affiliation: "bepocart",
        payment_method: orderData?.payment_method, // Corrected 'payment_methord'
        coupon_code: orderData?.coupon_code,
        currency: "INR",
        transaction_id: orderData?.transaction_id,
        item_brand: "bepocart",
        customer_segment: orderData?.customer_segment,
        value: orderData?.value,
      });
    }
  }, [orderData]);
  

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center transform transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-200">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Order Confirmed!
        </h2>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your order has been successfully placed,
          and an email confirmation is on its way.
        </p>
        <div className="text-sm text-gray-500 mb-4">
          Transaction ID: <strong>{orderData?.transaction_id || "N/A"}</strong>
        </div>
        <button
          onClick={handleBackToHome}
          className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
        >
          Back to Home
        </button>
        <div className="mt-8 text-gray-500 text-sm">
          Need assistance? <a href="/" className="text-blue-600 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
