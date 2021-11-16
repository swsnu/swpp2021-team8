import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReview, editReview } from '../../store/ReviewStore';
import './ReviewListItem.scss';

const ReviewListItem = () => {
  const dispatch = useDispatch();
  const [editDetail, setEditDetail] = useState('');

  const review = {
    id: 1,
    content: 1,
    detail: 'I love it. This was the best movie of my life!!',
    user: 'swpp',
    created_at: '2021-11-11',
  };

  const onEditClick = () => {
    const changedDetail = prompt('Edit Review', review.detail);
    if (changedDetail !== null) {
      if (changedDetail === '') {
        setEditDetail(changedDetail);
      }
      dispatch(editReview(review.id, editDetail));
    }
  };

  const onDeleteClick = () => {
    dispatch(deleteReview(review.id));
  };

  return (
    <>
      <div className="review">
        <div className="review__detail">
          {review.detail}
        </div>
        <div className="review__user">
          {review.user}
        </div>
        <div className="review__createdat">
          {review.created_at}
        </div>
        <div className="buttons">
          <button id="edit-button" onClick={onEditClick} type="button">
            Edit
          </button>
          <button id="delete-button" onClick={onDeleteClick} type="button">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ReviewListItem;
