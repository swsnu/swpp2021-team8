import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReviewList from '../../components/review/ReviewList';
import { addFavoriteContent, deleteFavoriteContent, getContentDetail, getIsFavoriteContent } from '../../store/ContentStore';
import { createReview, getReviews } from '../../store/ReviewStore';
import './ContentDetailPage.scss';

const ContentDetailPage = ({ history }) => {
  const { id } = useParams();
  const user1 = {
    id: 1,
    username: 'swpp',
  };
  const dispatch = useDispatch();
  const content = useSelector((state) => state.content.selectedContent);
  const favorite = useSelector((state) => state.content.isFavorite);

  const [newReview, setnewReview] = useState('');
  const [reviewAdded, setReviewAdded] = useState(false);
  const [otherFavoriteCnt, setOtherFavoriteCnt] = useState(0);
  const [myFavoriteCnt, setMyFavoriteCnt] = useState(0);
  const [favButtonId, setFavButtonId] = useState('heart_false');

  useEffect(() => {
    dispatch(getContentDetail(id));
    dispatch(getIsFavoriteContent(user1.id, id));
    dispatch(getReviews(id));
  }, [id]);

  useEffect(() => {
    if (content.id && favorite) {
      if (favorite.is_favorite) {
        setMyFavoriteCnt(1);
        setFavButtonId('heart_true');
      }
      setOtherFavoriteCnt(content.favorite_cnt - myFavoriteCnt);
    }
  }, [content, favorite]);

  useEffect(() => {
    dispatch(getReviews(id));
  }, [reviewAdded]);

  const gradientStyle = {
    background: 'linear-gradient(#C99208 5%, #000000 60%)',
  };

  const onReviewContentChange = (e) => {
    setnewReview(e.target.value);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onFavoriteClick = () => {
    setMyFavoriteCnt(1 - myFavoriteCnt);
    if (myFavoriteCnt === 0) {
      setFavButtonId('heart_true');
      dispatch(addFavoriteContent(user1.id, id));
    } else {
      setFavButtonId('heart_false');
      dispatch(deleteFavoriteContent(user1.id, id));
    }
  };

  const onCreateReviewClick = (e) => {
    e.preventDefault();
    const review = {
      content: content.id,
      detail: newReview,
      user: user1,
    };
    setReviewAdded(!reviewAdded);
    dispatch(createReview(id, review));
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
            <div className="contentdetail__name">
              {content.name}
            </div>
            <div className="contentdetail__favorite">
              <button id={favButtonId} onClick={onFavoriteClick} type="button" aria-label="favorite" />
              <div className="contentdetail__favoritecount">
                {otherFavoriteCnt + myFavoriteCnt}
              </div>
              <div className="contentdetail__rate">
                IMDb&nbsp;&nbsp;
                {content.rate}
                &nbsp;/&nbsp;10
              </div>
            </div>
            <div className="contentdetail__genre">
              Genres&nbsp;&nbsp;:&nbsp;&nbsp;
              {content.genres}
            </div>
            <div className="contentdetail__cast">
              Actors&nbsp;&nbsp;:&nbsp;&nbsp;
              {content.cast}
            </div>
            <div className="contentdetail__director">
              Director&nbsp;&nbsp;:&nbsp;&nbsp;
              {content.director}
            </div>
            <div className="contentdetail__releasedate">
              Released On&nbsp;&nbsp;:&nbsp;&nbsp;
              {content.release_date}
            </div>
            <div className="contentdetail__ott">
              <p>
                Where To Watch :
              </p>
              {content.ott}
            </div>
          </div>
        </div>
        <div className="contentdetail__overview">
          {content.overview}
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
              value={newReview}
              onChange={onReviewContentChange}
            />
            <button
              id="create-review-button"
              onClick={onCreateReviewClick}
              type="button"
              disabled={newReview === ''}
            >
              write
            </button>
          </div>
          <div className="contentdetail__reviewlist">
            <ReviewList contentId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
