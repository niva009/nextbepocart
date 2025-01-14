'useclinet'

import React, { FC, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ModalProps {
  productId: string;
  onClose: () => void;
}

export const ReviewModal: FC<ModalProps> = ({ productId, onClose }) => {
  const [rating, setRating] = useState<number>(0); // Selected star rating
  const [reviewText, setReviewText] = useState<string>(''); // Review text
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const addReview = async () => {
    if (rating === 0 || reviewText.trim() === '') {
      toast.error('Please select a rating and write a review.', { position: 'top-right', autoClose: 1500 });
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `https://patrick-north-power-fence.trycloudflare.com/product-review/${productId}/`,
        {
          rating:rating,
          review_text: reviewText,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Review added successfully!', { position: 'top-right', autoClose: 1500 });
      localStorage.setItem("review product",productId )
      onClose();
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { position: 'top-right', autoClose: 1500 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Add Review"
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
        <h2 className="text-lg font-semibold mb-4">Add a Review</h2>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating:</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Write your review here..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            onClick={addReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
