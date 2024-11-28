import { FC, useEffect, useState } from 'react';
import ReviewCard from '@components/cards/review-card';
import ReviewForm from '@components/common/form/review-form';
import { useTranslation } from 'src/app/i18n/client';

interface Review {
  id: number;
  rating: number;
  title: string;
  description: string;
  author: string;
}

const ProductReviewRating: FC<{ lang: string; productId: string }> = ({ lang, productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { t } = useTranslation(lang, 'common');

  useEffect(() => {
    // Fetch reviews using the fetch API
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://72.167.55.172:8000/review/${productId}/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setReviews(data); // Assume the API response is an array of reviews
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]); // Re-fetch reviews if productId changes


  return (
    <div className="lg:flex">
      <div className="pt-2">
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <ReviewCard item={item} key={`review-key-${item.id}`} lang={lang} />
          ))
        ) : (
          <p>{t('No reviews available.')}</p>
        )}
      </div>
      <ReviewForm
        className="lg:w-[500px] xl:w-[540px] 2xl:w-[600px] 3xl:w-[730px] lg:ltr:pl-10 lg:rtl:pr-10 xl:ltr:pl-14 xl:rtl:pr-14 3xl:ltr:pl-20 3xl:rtl:pr-20 shrink-0 pt-10"
        lang={lang}
      />
    </div>
  );
};

export default ProductReviewRating;
