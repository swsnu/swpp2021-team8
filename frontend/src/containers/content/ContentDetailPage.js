import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useLocation } from 'react-router-dom';
import ReviewList from '../../components/review/ReviewList';
import { addFavoriteContent } from '../../store/ContentStore';
import { createReview } from '../../store/ReviewStore';
import './ContentDetailPage.scss';
import posterTmp from './temp/best_offer.png';

const ContentDetailPage = ({ history }) => {
  // const location = useLocation();
  // const path = location.pathname.split('/')[2];
  const user1 = {
    id: 1,
    username: 'swpp',
  };

  const dispatch = useDispatch();

  const [content, setContent] = useState({
    id: 1,
    the_movie_id: 1,
    name: 'Best Offer',
    description: 'A lonely art expert working for a mysterious and reclusive heiress finds not only her art worth examining.',
    favorite_cnt: 0,
    favorite_users: [],
    poster: posterTmp,
    category: 'Crime, Drama',
    staff: 'Director | Giuseppe Tornatore\nWriter | Giuseppe Tornatore\nStars | Geoffrey, RushJim, SturgessSylvia Hoeks',
  });
  const [newComment, setnewComment] = useState('');

  const gradientStyle = {
    background: 'linear-gradient(#C99208 5%, #000000 60%)',
  };

  const onReviewContentChange = (e) => {
    setnewComment(e.target.value);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onFavoriteClick = () => {
    setContent({
      ...content,
      favorite_users: [...content.favorite_users, user1],
    });
    dispatch(addFavoriteContent(user1.id, content.id));
  };

  const onCreateReviewClick = () => {
    const Review = {
      content: content.id,
      detail: newComment,
      user: user1,
    };
    dispatch(createReview(content.id, Review));
  };

  const renderField = (category, detail) => {
    const classname = 'contentdetail__field '.concat(category.toLowerCase());
    return (
      <div className={classname}>
        <div className={category.toLowerCase().concat(' category')}>
          {category}
        </div>
        <div className={category.toLowerCase().concat(' detail')}>
          {detail}
        </div>
      </div>
    );
  };

  return (
    <div className="contentdetail">
      <button id="back-button" onClick={onBackClick} type="button">
        &#9664; Back
      </button>
      <div className="contentdetail__main" style={gradientStyle}>
        <div className="contentdetail__header">
          <div className="contentdetail__left">
            <img className="contentdetail__poster" src={content.poster} alt="poster" />
          </div>
          <div className="contentdetail__right">
            <h1 className="contentdetail__name">
              {content.name}
            </h1>
            <div className="contentdetail__favorite">
              <button id="heart" onClick={onFavoriteClick} type="button" aria-label="favorite" />
              <div className="contentdetail__favoritecount">
                {content.favorite_cnt}
              </div>
            </div>
            <div className="contentdetail__category">
              {content.category}
            </div>
            <div className="contentdetail__staff">
              {content.staff}
            </div>
          </div>
        </div>
        <div className="contentdetail__body">
          {renderField('Description', content.description)}
        </div>
        <br />
        <div className="contentdetail__footer">
          <h1 className="contentdetail__name">
            Review
          </h1>
          <br />
          <div className="contentdetail__review">
            <input
              type="text"
              id="new-review-content-input"
              value={newComment}
              onChange={onReviewContentChange}
            />
            <button
              id="create-review-button"
              onClick={onCreateReviewClick}
              type="button"
              disabled={newComment === ''}
            >
              write
            </button>
          </div>
          <div className="contentdetail__reviewlist">
            <ReviewList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
