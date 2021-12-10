import { React } from 'react';
import { useSelector } from 'react-redux';
import './ReviewListItem.scss';

const ReviewListItem = ({ review, onEdit, onDelete }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div className="review">
        <div className="review__detail">{review.detail}</div>
        <div className="review__user">{review.username}</div>
        <div className="review__createdat">{review.created_at}</div>
        <div className="buttons">
          {review.user_id === user.id ? (
            <div className="review-detail-buttons">
              <button
                id="edit-button"
                onClick={() => onEdit(review)}
                type="button"
              >
                Edit
              </button>
              <button
                id="delete-button"
                onClick={() => onDelete(review)}
                type="button"
              >
                Delete
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewListItem;
