// WishlistModal.tsx
import React, { FC, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ModalProps {
  slug: string;
  onClose: () => void;
  deleteItem: () => void; // Corrected type
}

export const WishlistModal: FC<ModalProps> = ({ slug, onClose, deleteItem }) => {
  const [productDetails, setProductDetails] = useState<any>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`https://bepocart.in/product/${slug}/`);
      const productData = response.data;
      setProductDetails(productData);

      if (productData.product.type === 'single') {
        setSelectedColor(productData.images[0]?.color || '');
        setSelectedSize(productData.images[0]?.stock || '');
      } else {
        setSelectedColor(productData.images[0]?.color || '');
        setSelectedSize(productData.images[0]?.stock_info[0]?.size || '');
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const availableSizes = () => {
    if (!productDetails || !selectedColor || productDetails.product?.type === 'single') return [];
    const colorImage = productDetails.images?.find((image) => image.color === selectedColor);
    return colorImage ? colorImage.stock_info.filter((stock) => stock.stock > 0) : [];
  };

  // Fetch product details when modal opens
  React.useEffect(() => {
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
      deleteItem(); // Removed productId as deleteItem does not take any arguments
      onClose();

      const toastStatus = "product add to cart successfull"

    setTimeout(() => {
    }, 1500);

    toast(toastStatus, {
      progressClassName: 'fancy-progress-bar',
      position: window.innerWidth > 768 ? 'top-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    } catch (error: any) {
      console.log("Error adding product to cart:", error);

      const toastStatus = "error adding to cart .!"+`${error.response?.data?.message || error.message}`

      setTimeout(() => {
      }, 2500);
  
      toast.error(toastStatus, {
        className: 'toast-error',
        progressClassName: 'fancy-progress-bar',
        position: window.innerWidth > 768 ? 'top-right' : 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  };

  const availableStock = () => {
    if (!productDetails) return false;

    if (productDetails.product.type === 'single') {
      const colorImage = productDetails.images.find(image => image.color === selectedColor);
      const productStock = colorImage?.stock ?? 0;
      return productStock === 0;
    }

    if (productDetails.product.type === 'variant') {
      if (!selectedColor) return false;

      const colorImage = productDetails.images.find(image => image.color === selectedColor);

      return !colorImage || !colorImage.stock_info || colorImage.stock_info.every(stock => stock.stock === 0);
    }
    return false;
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Select Size and Color"
      className="modal"
      ariaHideApp={false}
    >
      <div className="p-4">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Select Size and Color</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {availableSizes().map((stock) => (
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
