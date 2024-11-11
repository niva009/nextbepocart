import { FC } from 'react';

const ShippingPolicy: FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 mb-20">Shipping Policy</h1>
      <p className="text-sm text-center italic mb-12">
        Note: This policy is subject to change at any time without notice. Please review this policy periodically to stay informed. We are committed to the utmost satisfaction of our cherished cyclists.
      </p>

      {/* Order Processing Timeline */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order Processing Timeline</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We only ship within the Indian subcontinent to locations serviceable by our logistics partners.</li>
          <li>Orders are typically dispatched within 24 hours of placement.</li>
          <li>Order processing is suspended on Sundays, public holidays, and during any geographical or political disturbances.</li>
          <li>Cash on Delivery (COD) orders require additional confirmation via WhatsApp from the provided contact number.</li>
          <li>The customer is responsible for providing correct address and contact information.</li>
        </ul>
      </section>

      {/* Shipping Charges */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shipping Charges</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Orders over Rs. 500 are eligible for free shipping.</li>
          <li>For COD orders, a convenience fee of Rs. 40 applies.</li>
          <li>COD is available for orders up to Rs. 29,999.</li>
          <li>Additional shipping charges for orders below Rs. 500: Rs. 60.</li>
          <li>Express Shipping is available for pre-paid orders upon request (additional charges apply).</li>
        </ul>
      </section>

      {/* Shipping Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shipping Services</h2>
        <div>
          <h3 className="text-xl font-medium mb-2">Standard Shipping</h3>
          <p>
            The delivery timeframe for this shipping option ranges from 3 to 7 business days, depending on distance and location. Orders are typically dispatched via road or air for efficient and reliable delivery.
          </p>
        </div>
      </section>

      {/* Contacting Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contacting Us</h2>
        <p className="mb-2">
          If you have any questions about this Shipping Policy, our practices, or your interactions with us, please contact us at:
        </p>
        <p className="font-medium">Phone: <a href="tel:+917025494747" className="text-blue-600 hover:underline">+91 7025494747</a></p>
        <p className="font-medium">Email: <a href="mailto:contact@bepocart.com" className="text-blue-600 hover:underline">contact@bepocart.com</a></p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
