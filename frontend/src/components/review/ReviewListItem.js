import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, editReview } from '../../store/ReviewStore';
import './ReviewListItem.scss';

const ReviewListItem = ({ review }) => {
  const dispatch = useDispatch();
  const [editDetail, setEditDetail] = useState('');
  const logginUserId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    console.log(review);
  }, []);

  const onEditClick = () => {
    /* eslint no-alert: ['off'] */
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
        <div className="review__detail">{review.detail}</div>
        <div className="review__user">{review.user}</div>
        <div className="review__createdat">{review.created_at}</div>
        <div className="buttons">
          {review.user_id === logginUserId ?
            (
              <div className="review-detail-buttons">
                <button id="edit-button" onClick={onEditClick} type="button">
                  Edit
                </button>
                <button id="delete-button" onClick={onDeleteClick} type="button">
                  Delete
                </button>
              </div>
            )
            :
              <></>}
        </div>
      </div>
    </>
  );
};

export default ReviewListItem;
