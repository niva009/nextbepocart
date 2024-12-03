import React, { FC, useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQueryClient } from 'react-query';

interface ModalProps {
  slug: string;
  onClose: () => void;
  deleteItem: () => void;
}

export const WishlistModal: FC<ModalProps> = ({ slug, onClose, deleteItem }) => {
  const [productDetails, setProductDetails] = useState<any>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const queryClient = useQueryClient(); // Initialize the query client


  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`https://bepocart.in/product/${slug}/`);
      const productData = response.data;
      setProductDetails(productData);

      if (productData.product.type === 'single') {
        setSelectedColor(productData.images?.[0]?.color || '');
        setSelectedSize(productData.images?.[0]?.stock || '');
      } else {
        setSelectedColor(productData.images?.[0]?.color || '');
        setSelectedSize(productData.images?.[0]?.stock_info?.[0]?.size || '');
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      await axios.post(
        `https://bepocart.in/cart/${productId}/`,
        {
          size: selectedSize,
          color: selectedColor,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      queryClient.invalidateQueries(API_ENDPOINTS.CART); 
      deleteItem();
      onClose();
        toast.success("Product added to cart successfully!", { position: "top-right" , autoClose:1500});

    } catch (error: any) {
      console.error("Error adding product to cart:", error);

        toast.error(`Error adding to cart: ${error.response?.data?.message || error.message}`, { position: "top-right", autoClose:1500 });
    }
  };

  const availableStock = () => {
    if (!productDetails) return false;
    const colorImage = productDetails.images?.find(image => image.color === selectedColor);
    return productDetails.product.type === 'single'
      ? colorImage?.stock === 0
      : colorImage?.stock_info?.every(stock => stock.stock === 0);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Select Size and Color"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 1001,
        },
      }}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Select Size and Color</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {productDetails?.images?.map((image) => (
              <option key={image.id} value={image.color}>
                {image.color}
              </option>
            ))}
          </select>
        </div>
        {productDetails?.product?.type !== 'single' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {productDetails?.images
                ?.find((img) => img.color === selectedColor)
                ?.stock_info?.map((stock) => (
                  <option key={stock.size} value={stock.size}>
                    {stock.size}
                  </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={() => addToCart(productDetails?.product.id)}
            disabled={availableStock()}
          >
            {availableStock() ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
