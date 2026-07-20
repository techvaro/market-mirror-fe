import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { reviews as mockReviews, Review } from '@/data/mockData';

type ReviewsContextType = {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
  getReviewsByShopId: (shopId: number) => Review[];
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return mockReviews;
  });

  useEffect(() => {
    localStorage.setItem('market_mirror_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Omit<Review, 'id'>) => {
    const id = Math.max(...reviews.map(r => r.id), 0) + 1;
    setReviews(prev => [{ ...review, id }, ...prev]);
  };

  const getReviewsByShopId = (shopId: number) => {
    return reviews.filter(r => r.shopId === shopId);
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReviewsByShopId }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within ReviewsProvider');
  return context;
};
