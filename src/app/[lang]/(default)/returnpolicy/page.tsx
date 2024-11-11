import { FC } from 'react';

const ReturnPolicy: FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 mb-10">Return Policy</h1>
      <p className="text-sm text-center italic mb-12">
        Note: This policy is subject to change at any time without notice. Please review this policy periodically to stay informed.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p>
          We value our customers and want to ensure a positive shopping experience. Our 5-day Return Policy is designed to help you with returns in a simple and straightforward manner. If you need further assistance, feel free to reach out to us via call or WhatsApp.
        </p>
      </section>

      {/* Returns Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Returns</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We only ship within the Indian subcontinent to locations serviceable by our logistics partners.</li>
          <li>Return requests must be initiated within 5 days of receiving your order.</li>
          <li>Once approved, you have 10 days to send the product back to us.</li>
          <li>Refunds will be processed after a Quality Check (QC) to the original payment method or as store credit, per your preference.</li>
        </ul>
      </section>

      {/* Return Methods */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Return Methods</h2>
        <h3 className="text-xl font-medium mb-2">Self-Ship</h3>
        <p>
          Customers are required to ship the product back to our warehouse at their own cost. Please securely pack the product to prevent damage during transit. The return address is:
        </p>
        <address className="mt-2 p-4 bg-gray-100 border rounded">
          Michael Exports and Imports<br />
          GV Ayyer Rd, Willingdon Island<br />
          Kochi, Kerala 682003, India
        </address>
      </section>

      {/* Return Eligibility */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>The product must be unused, unwashed, and in re-sellable condition.</li>
          <li>All original tags, manuals, and packaging should be intact.</li>
          <li>The packaging should not be damaged, opened, or tampered with.</li>
          <li>A receipt or proof of purchase is required.</li>
          <li>Any promotional items shipped with the purchased item must also be returned.</li>
          <li>The product should be securely packed to prevent damage during transit.</li>
        </ul>
      </section>

      {/* Exclusions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Exclusions</h2>
        <p>The following products cannot be returned or exchanged:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Bicycles, Trainers, Wheels, Floor Pumps, Framesets, Forks/Suspensions, Work Stands, Tool Kits, Car Racks, Wetsuits, Nutrition items, Bike Cases/Bags, Sunglasses, Smartwatches, Spokes, Nipples, Pannier Racks, Display Stands, and Small Parts.</li>
          <li>Refurbished items are also not eligible for return.</li>
        </ul>
      </section>

      {/* Return Process */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Return Process</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Contact us via call or WhatsApp within 5 days of receiving your order to initiate a return request.</li>
          <li>Once approved, you have 10 days to ship the item back to our warehouse.</li>
          <li>A Quality Check (QC) will be conducted upon receiving the item. If the product passes QC, we will initiate the refund.</li>
          <li>If the product fails the QC, it will be sent back to you at your cost.</li>
        </ol>
      </section>

      {/* Return Instructions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Return Instructions</h2>
        <p>
          Please ensure the item is packed securely to prevent damage during transit, as damaged items may be rejected for return.
        </p>
      </section>

      {/* Contacting Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contacting Us</h2>
        <p>If you have any questions about this Return Policy, please reach out to us:</p>
        <p className="font-medium mt-2">Phone/WhatsApp: <a href="tel:+916235402223" className="text-blue-600 hover:underline">+91 6235402223</a></p>
        <address className="mt-2 p-4 bg-gray-100 border rounded">
          Michael Exports and Imports<br />
          GV Ayyer Rd, Willingdon Island<br />
          Kochi, Kerala 682003, India
        </address>
      </section>
    </div>
  );
};

export default ReturnPolicy;
