import React, { useState } from 'react';
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
  onQuantityChange: (id: string, quantity: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ lang, item, onRemove, onQuantityChange }) => {
  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("User is not authenticated");
      
      await axios.delete(`https://bepocart.in/cart-delete/${id}/`, {
        headers: { Authorization: ` ${token}` },
      });
      onRemove(id);
      console.log("Item deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
    }
  };

  const increment = () => item.quantity < item.stock && onQuantityChange(item.id, item.quantity + 1);
  const decrement = () => item.quantity > 1 && onQuantityChange(item.id, item.quantity - 1);

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
      <div className="flex items-start justify-between w-full">
        <div className="pl-3">
          <Link href={`/${lang}${ROUTES.PRODUCT}/${item?.slug}`} className="block text-brand-dark text-13px hover:text-brand">
            {item?.name}
          </Link>
          <div className="text-13px text-brand-muted mt-1.5">₹{item?.salePrice}</div>
          <div className="text-13px text-brand-muted mt-1.5">Color: {item?.color}</div>
          <div className="text-13px text-brand-muted mt-1.5">Size: {item?.size}</div>
          <div className="flex items-center w-[120px] h-[40px] px-[26px] border border-qgray-border">
            <button onClick={decrement} className="text-base text-qgray">-</button>
            <span className="text-qblack">{item.quantity}</span>
            <button onClick={increment} className="text-base text-qgray" disabled={item.quantity >= item.stock}>+</button>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[80px]">
          <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteProduct(item.id)} title="Remove item">
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
