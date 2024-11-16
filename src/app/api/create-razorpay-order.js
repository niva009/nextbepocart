// pages/api/create-razorpay-order.js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Public key for client-side use
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET, // Secret key for server-side use
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, currency, receipt } = req.body;

    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: currency || 'INR',
        receipt,
        payment_capture: 1, // Auto-capture payment
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
