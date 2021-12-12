import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../../components/base/Loading';
import ReviewList from '../../components/review/ReviewList';
import {
  addFavoriteContent,
  deleteFavoriteContent,
  getContentDetail,
  getIsFavoriteContent,
} from '../../store/ContentStore';
import {
  createReview,
  deleteReview,
  editReview,
  getReviews,
} from '../../store/ReviewStore';
import './ContentDetailPage.scss';

const ContentDetailPage = ({ history }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const content = useSelector((state) => state.content.selectedContent);
  const favorite = useSelector((state) => state.content.isFavorite);
  const reviews = useSelector((state) => state.review.reviews);

  const [newReview, setNewReview] = useState('');
  const [favButtonId, setFavButtonId] = useState('heart_false');

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dispatch(getContentDetail(id));
  }, []);

  useEffect(() => {
    setFavButtonId(favorite ? 'heart_true' : 'heart_false');
  }, [favorite]);

  useEffect(() => {
    if (parseInt(content.id, 10) === parseInt(id, 10)) {
      dispatch(getIsFavoriteContent(user.id, id));
      dispatch(getReviews(id));
    }
  }, [content]);

  const gradientStyle = {
    background: 'linear-gradient(#C99208 5%, #000000 60%)',
  };

  const onReviewContentChange = (e) => {
    setNewReview(e.target.value);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onFavoriteClick = async () => {
    if (!favorite) {
      dispatch(addFavoriteContent(user.id, id));
    } else {
      dispatch(deleteFavoriteContent(user.id, id));
    }

    getContentDetail(id);
  };

  const onEditReviewClick = (review) => {
    MySwal.fire({
      title: 'Edit your review!',
      input: 'text',
      inputValue: review.detail,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Edit',
      showLoaderOnConfirm: true,
      preConfirm: (changedReview) => {
        if (changedReview && changedReview !== review.detail) {
          dispatch(editReview(review.id, changedReview));
        }
      },
      allowOutsideClick: () => !MySwal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire('Edited!', 'Your review has been edited!', 'success');
      }
    });
  };

  const onDeleteReviewClick = (review) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Your review will be deleted forever!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(review.id));
        MySwal.fire('Deleted!', 'Your review has been deleted!', 'success');
      }
    });
  };

  const onCreateReviewClick = (e) => {
    e.preventDefault();
    const review = {
      content: content.id,
      detail: newReview,
      user,
    };
    dispatch(createReview(id, review));
    setNewReview('');
  };

  return (
    <>
      {parseInt(content.id, 10) === parseInt(id, 10) ? (
        <div className="contentdetail">
          <button id="back-button" onClick={onBackClick} type="button">
            &#9664; Back
          </button>
          <div className="contentdetail__main" style={gradientStyle}>
            <div className="contentdetail__header">
              <div className="contentdetail__left">
                <img
                  className="contentdetail__poster"
                  src={content.poster}
                  alt="poster"
                />
              </div>
              <div className="contentdetail__right">
                <div className="contentdetail__name">{content.name}</div>
                <div className="contentdetail__favorite">
                  <button
                    id={favButtonId}
                    onClick={onFavoriteClick}
                    type="button"
                    aria-label="favorite"
                  />
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
                  <p>Where To Watch :</p>
                  {content.ott}
                </div>
              </div>
            </div>
            <div className="contentdetail__overview">{content.overview}</div>
            <br />
            <div className="contentdetail__footer">
              <h1 className="contentdetail__name">Review</h1>
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
                <ReviewList
                  reviews={reviews}
                  onEdit={onEditReviewClick}
                  onDelete={onDeleteReviewClick}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ContentDetailPage;
