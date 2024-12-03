import React, { useState } from 'react';
import { Item } from '@contexts/cart/cart.utils';
import Image from '@components/ui/image';
import { generateCartItemName } from '@utils/generate-cart-item-name';

export const CheckoutItem: React.FC<{ item: Item }> = ({ item }) => {
  const [showFullName, setShowFullName] = useState(false);
  const maxNameLength = 20; 
  // Function to toggle full name view
  const toggleFullName = () => setShowFullName(!showFullName);

  const displayName = showFullName
    ? generateCartItemName(item.name, item.attributes)
    : `${generateCartItemName(item.name, item.attributes).slice(0, maxNameLength)}${
        item.name.length > maxNameLength ? '...' : ''
      }`;

  return (
    <div className="flex items-center py-4 border-b border-border-base">
      <div className="flex w-16 h-16 border rounded-md border-border-base shrink-0">
        <img
          src={`https://bepocart.in/${item?.image}`}
          alt="item image"
          className="rounded-md ltr:mr-5 rtl:ml-5"
          width={64}
          height={64}
          style={{ width: 'auto' }}
        />
      </div>
      <div className="flex flex-col ltr:pl-3 rtl:pr-3">
        <h6 className="font-normal text-15px text-brand-dark">
          {displayName}
          {item.name.length > maxNameLength && (
            <button
              onClick={toggleFullName}
              className="text-blue-500 ml-2 text-sm hover:underline"
            >
              {showFullName ? 'less' : 'more'}
            </button>
          )}
        </h6>
        {/* Display Quantity, Color, and Size in a user-friendly way */}
        <div className="text-sm text-gray-500 mt-1">
          <p>
            <span className="font-medium">Quantity:</span> {item.quantity}
          </p>
          <span className="font-medium mt-2">Sale Price:</span> ₹{item.salePrice}
        </div>
      </div>
      <div className="flex font-normal ltr:ml-auto rtl:mr-auto text-15px text-brand-dark ltr:pl-2 rtl:pr-2 shrink-0">
        ₹ {item?.salePrice * item?.quantity}
      </div>
    </div>
  );
};
