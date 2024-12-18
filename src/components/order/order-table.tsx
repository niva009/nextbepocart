'use client';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { ReviewModal } from '@components/product/modal-review';

const OrderTable: React.FC<{ orders?: any[] }> = ({ orders = [] }) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reviewedProducts, setReviewedProducts] = useState<string[]>([]);

  // Fetch reviewed product IDs from localStorage
  useEffect(() => {
    const storedReviews = localStorage.getItem('reviewedProducts');
    if (storedReviews) {
      try {
        const parsedReviews = JSON.parse(storedReviews);
        setReviewedProducts(Array.isArray(parsedReviews) ? parsedReviews : []);
      } catch {
        setReviewedProducts([]);
      }
    }
  }, []);

  // Save a new reviewed product ID to localStorage
  const addProductToReviewed = (productId: string) => {
    const updatedReviews = [...reviewedProducts, productId];
    setReviewedProducts(updatedReviews);
    localStorage.setItem('reviewedProducts', JSON.stringify(updatedReviews));
  };

  // Toggle expanded state for the row
  const toggleReadMore = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Trigger the review modal and set the selected order ID
  const triggerReview = (productId: string) => {
    setSelectedOrderId(productId);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Quantity</th>
            <th className="px-4 py-2 border-b">Price</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Order Date</th>
            <th className="px-4 py-2 border-b">Review</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="px-4 py-2 border-b">
                {expandedRows[order.id] || order.name.length <= 20
                  ? order.name
                  : `${order.name.substring(0, 20)}... `}
                {order.name.length > 20 && (
                  <button
                    onClick={() => toggleReadMore(order.id)}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {expandedRows[order.id] ? 'Show less' : 'Read more'}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 border-b">
              <img
  src={`https://bepocart.in/${order.image}`}
  alt="Product"
  className="w-16 h-16 object-cover rounded"
/>

              </td>
              <td className="px-4 py-2 border-b">{order.quantity}</td>
              <td className="px-4 py-2 border-b">₹{order.price}</td>
              <td className="px-4 py-2 border-b capitalize">{order.status}</td>
              <td className="px-4 py-2 border-b">
                {dayjs(order.created_at).format('DD MMM YYYY')}
              </td>
              <td className="px-4 py-2 border-b">
                {reviewedProducts.includes(order.product) ? (
                  <span className="text-green-600 font-semibold">Review already added</span>
                ) : order.status === 'Completed' ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => triggerReview(order.product)}
                  >
                    Add Review
                  </button>
                ) : (
                  'please add a review after the order is completed'
                )}
              </td>
            </tr>
          ))}

          {isModalOpen && selectedOrderId && (
            <ReviewModal
              productId={selectedOrderId}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedOrderId(null);
                addProductToReviewed(selectedOrderId); // Mark the product as reviewed
              }}
            />
          )}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-center py-4">No orders found.</p>}
    </div>
  );
};

export default OrderTable;
