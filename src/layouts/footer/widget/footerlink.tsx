import React from 'react';
import Link from 'next/link';

const FooterLinks: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
     <h3 className='font-bold'>Quick Links</h3>
      <Link href="/en/about" className="text-sm text-gray-600 hover:underline">
        About
      </Link>
      <Link href="/en/contact-us" className="text-sm text-gray-600 hover:underline">
        Contact
      </Link>
      <Link href="/en/privacy-policy" className="text-sm text-gray-600 hover:underline">
        Privacy Policy
      </Link> <Link href="en/returnpolicy" className="text-sm text-gray-600 hover:underline">
        return Policy
      </Link>
      <Link href="en/shipping" className="text-sm text-gray-600 hover:underline">
        shipping Policy
      </Link>
    </div>
  );
};

export default FooterLinks;
