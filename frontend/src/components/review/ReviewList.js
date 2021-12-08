import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../../store/ReviewStore';
import ReviewListItem from './ReviewListItem';

const ReviewList = ({ contentId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.reviews);

  useEffect(() => {
    dispatch(getReviews(contentId));
  }, [contentId]);

  return (
    <div className="reviewList">
      {reviews.map((r) => (
        <ReviewListItem review={r} />
      ))}
    </div>
  );
};

export default ReviewList;
