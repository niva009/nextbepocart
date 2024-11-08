import React from 'react';
import Link from '@components/ui/link';
import Image from '@components/ui/image';
import { ROUTES } from '@utils/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

type CartItemProps = {
  item: any;
  lang: string;
  onRemove: (id: string) => void;
  onQuantityIncrement: (id: string, quantity: number) => void;
  onQuantityDecrement: (id: string, quantity: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ lang, item, onRemove, onQuantityIncrement, onQuantityDecrement }) => {
  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      await axios.delete(`https://bepocart.in/cart-delete/${id}/`, {
        headers: { Authorization: `${token}` },
      });
      onRemove(id);
      console.log("Item deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
    }
  };

  const increment = () => {
    if (item.quantity < item.stock) {
      onQuantityIncrement(item.id, item.quantity + 1);
    }
  };

  const decrement = () => {
    if (item.quantity > 1) {
      onQuantityDecrement(item.id, item.quantity - 1);
    }
  };

  // Calculate the total price for this item
  const itemTotalPrice = item.quantity * item.salePrice;

  return (
    <div className="group w-full flex items-center text-brand-light py-4 border-b border-border-one relative">
      <div className="relative flex rounded overflow-hidden w-[90px] h-[90px]">
        <Image
          src={item?.image}
          width={100}
          height={100}
          alt={item.name || 'Product Image'}
          className="object-cover"
        />
      </div>
      <div className="flex items-start justify-between w-full pl-3">
        <div>
          <Link href={`/${lang}${ROUTES.PRODUCT}/${item?.slug}`} className="block text-brand-dark text-13px hover:text-brand">
            {item?.name}
          </Link>
          <div className="text-13px text-brand-muted mt-1.5">₹{item?.salePrice} each</div>
          <div className="text-13px text-brand-muted mt-1.5">Color: {item?.color}</div>
          <div className="text-13px text-brand-muted mt-1.5">Size: {item?.size}</div>

          {/* Quantity Increment and Decrement Controls */}
          <div className="flex items-center space-x-2 mt-2">
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-black"
              onClick={decrement}
              disabled={item.quantity <= 1}  
            >
              -
            </button>
            <span className="text-base text-black">{item.quantity}</span>
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-black"
              onClick={increment}
              disabled={item.quantity >= item.stock} 
            >
              +
            </button>
          </div>

          {/* Total Price for This Item */}
          <div className="text-13px text-brand-dark font-semibold mt-2">
            Total: ₹{itemTotalPrice.toFixed(2)}
          </div>
        </div>

        {/* Remove Item Button */}
        <div className="flex flex-col items-end min-w-[80px]">
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteProduct(item.id)}
            title="Remove item"
          >
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
