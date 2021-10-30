import React, { useState } from 'react';
import ReviewList from '../../components/review/ReviewList';

const ContentDetailPage = ({ history }) => {
  const [content, setContent] = useState('');

  const onReviewContentChange = (e) => {
    setContent(e.target.value);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onFavoriteClick = () => {
    // TODO
  };

  const onReviewRateClick = () => {
    // TODO
  };

  const onCreateReviewClick = () => {
    // TODO
  };

  return (
    <>
      <button id="back-button" onClick={onBackClick} type="button">
        Back
      </button>
      <button id="favorite-button" onClick={onFavoriteClick} type="button">
        favorite
      </button>
      <button
        id="new-review-rate-button"
        onClick={onReviewRateClick}
        type="button"
      >
        new-review-rate
      </button>
      <input
        type="text"
        id="new-review-content-input"
        value={content}
        onChange={onReviewContentChange}
      />
      <button
        id="create-review-button"
        onClick={onCreateReviewClick}
        type="button"
      >
        create-review
      </button>
      <ReviewList />
    </>
  );
};

export default ContentDetailPage;
