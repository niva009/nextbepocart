

"use client"; // This marks the component as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';
// import Becoin from '@public/assets/images/bepocoin.png';

export default function PrivacyPolicy() {
  const [coinCount, setCoinCount] = useState([]);
  const [coinValue, setCoinValue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://72.167.55.172:8000/coin/`, {
      headers: {
        'Authorization': `${token}`,
      },
    })
      .then((response) => {
        setCoinCount(response.data.data);
        setCoinValue(response.data.coinValue.value);
      })
      .catch((error) => {
        console.log("Error fetching coin data:", error);
      });
  }, []);

  console.log("bepocoinsssss", coinCount);

  const totalCoin = Array.isArray(coinCount) ? coinCount.reduce((sum, current) => sum + (current.amount || 0), 0) : 0;
  const totalPrice = totalCoin * coinValue;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 py-6 text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome to Our BeCoins Loyalty Program</h1>
        <p className="mt-2 text-sm">Rewarding you for every purchase and engagement with Bepocart!</p>
      </header>

      {/* Coin Summary Section */}
      <div className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center max-w-xl">
        <div className="flex items-center mb-6">
          <div className="mr-4 text-left">
            <p className="text-lg font-semibold text-gray-700">Total Coins</p>
            <p className="text-4xl font-bold text-yellow-500">{totalCoin}</p>
            <p className="mt-4 text-lg font-semibold text-gray-700">Total Amount</p>
            <p className="text-2xl font-bold text-yellow-500">{totalPrice} Rs</p>
          </div>
          {/* <Image src={Becoin} alt="Coin" width={100} height={100} className="rounded-full" /> */}
        </div>
        <p className="text-gray-600 leading-7">
          Earn and redeem BeCoins to maximize the value of your shopping experience with us.
        </p>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section: How to Earn BeCoins */}
        <Section title="How to Earn BeCoins">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Product Purchases: Earn BeCoins for every purchase.</li>
            <li>Referral System: Invite friends to shop and earn.</li>
            <li>Birthday Reward: Enjoy 50 bonus BeCoins on your birthday.</li>
            <li>Anniversary Reward: Get 50 bonus BeCoins on your membership anniversary.</li>
            <li>Action Rewards: Earn for reviews, sign-ups, and more.</li>
          </ul>
        </Section>

        {/* Section: Points Breakdown */}
        <Section title="Detailed Points Breakdown">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Product Review: Earn 50 BeCoins for each review.</li>
            <li>Sign Up: Receive 100 BeCoins when you sign up.</li>
            <li>First Purchase: Get 50 BeCoins on your first purchase.</li>
            <li>Referral Reward: Earn 10 BeCoins for every referred friend who purchases.</li>
            <li>Daily Login: Get 1 BeCoin each day you log in.</li>
          </ul>
          <Note text="If you're already logged in, log out and log back in to redeem daily login rewards." />
        </Section>

        {/* Section: How to Redeem BeCoins */}
        <Section title="How to Redeem BeCoins">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use BeCoins for discounts on future purchases or as payment.</li>
            <li>Conversion Rate: 10 BeCoins = 1 Rupee.</li>
            <li>Apply BeCoins at checkout for discounts or direct payment.</li>
          </ul>
          <Note text="The required BeCoins for redemption may vary by product. Check product details for specifics." />
        </Section>

        {/* Section: Points Expiration */}
        <Section title="Points Expiration">
          <p className="text-gray-700">
            BeCoins are valid for 90 days from the date earned. We'll notify you before expiration.
          </p>
        </Section>

        {/* Section: Membership Tiers */}
        <Section title="Membership Tiers and Benefits">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Bronze (50-600 BeCoins): Get 100 BECOINS free at this level.</li>
            <li>Silver (600-1200 BeCoins): Get 150 BECOINS free at this level.</li>
            <li>Gold (1200-2000 BeCoins): Get 200 BECOINS free at this level.</li>
            <li>Diamond (3000+ BeCoins): Get 300 BECOINS free at this level.</li>
          </ul>
          <Note text="The required BeCoins for redemption may vary by product. Check product details for specifics." />
        </Section>

        {/* FAQ Section */}
        <Section title="Frequently Asked Questions">
          <FAQ question="How do I join the BeCoins loyalty program?" answer="Create an account on our website to start earning BeCoins." />
          <FAQ question="Can I earn points for past purchases?" answer="Points can only be earned for purchases made after joining." />
          <FAQ question="How will I know if my points are about to expire?" answer="We’ll notify you via email before expiration." />
          <FAQ question="Can I combine my BeCoins with other discounts?" answer="Yes, unless specified otherwise." />
          <FAQ question="How do I redeem my points?" answer="Apply BeCoins at checkout for discounts or as payment." />
          <FAQ question="Are there restrictions on earning points?" answer="Points are earned on eligible purchases and actions. Specific rules may apply." />
        </Section>
      </div>
    </div>
  );
}

// Section Component for Consistent Styling
const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

// FAQ Component for Consistent FAQ Styling
const FAQ = ({ question, answer }) => (
  <div className="border-t border-gray-200 py-3">
    <h3 className="text-gray-700 font-medium">{question}</h3>
    <p className="text-gray-600 mt-1">{answer}</p>
  </div>
);

// Note Component to Emphasize Important Information
const Note = ({ text }) => (
  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mt-4">
    <p><strong>Note:</strong> {text}</p>
  </div>
);
