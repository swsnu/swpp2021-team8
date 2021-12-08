import React from 'react';
import ReviewListItem from './ReviewListItem';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  return (
    <div className="reviewList">
      {reviews.map((r) => (
        <ReviewListItem review={r} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ReviewList;
