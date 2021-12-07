import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReviewList from '../../components/review/ReviewList';
import { addFavoriteContent, getContentDetail } from '../../store/ContentStore';
import { createReview } from '../../store/ReviewStore';
import './ContentDetailPage.scss';
// import posterTmp from './temp/best_offer.png';

const ContentDetailPage = ({ history }) => {
  const { id } = useParams();
  const user1 = {
    id: 1,
    username: 'swpp',
  };

  const [newComment, setnewComment] = useState('');
  const [commentAdded, setCommentAdded] = useState(false);
  // const [favorite, setFavorite] = useState(false);

  const dispatch = useDispatch();
  const content = useSelector((state) => state.content.selectedContent);

  useEffect(() => {
    dispatch(getContentDetail(id));
  }, [id, commentAdded]);

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
    dispatch(addFavoriteContent(user1.id, id));
  };

  const onCreateReviewClick = () => {
    const review = {
      content: content.id,
      detail: newComment,
      user: user1,
    };
    setCommentAdded(!commentAdded);
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
              <button id="heart" onClick={onFavoriteClick} type="button" aria-label="favorite" />
              <div className="contentdetail__favoritecount">
                {content.favorite_cnt}
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
                Available on
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
