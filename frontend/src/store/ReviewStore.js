import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  reviews: [],
};

const _getReviews = (reviews) => {
  return { type: 'review/GET_REVIEWS', reviews };
};

const _createReview = (review) => {
  return { type: 'review/CREATE_REVIEW', review };
};

const _editReview = (review) => {
  return { type: 'review/EDIT_REVIEW', review };
};

const _deleteReview = (id) => {
  return { type: 'review/DELETE_REVIEW', id };
};

export const getReviews = (contentId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/content/${contentId}/review/`);
    dispatch(_getReviews(res.data));
  } catch (e) {}
};

export const createReview = (contentId, review) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/content/${contentId}/review/`, review);
    dispatch(_createReview(res.data));
  } catch (e) {}
};

export const editReview = (reviewId, reviewContent) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/review/${reviewId}/`, {
      detail: reviewContent,
    });
    dispatch(_editReview(res.data));
  } catch (e) {}
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    await axios.delete(`/api/review/${reviewId}/`);
    dispatch(_deleteReview(reviewId));
  } catch (e) {}
};

export default function ContentReducer(state = initialState, action) {
  switch (action.type) {
    case 'review/GET_REVIEWS':
      return { ...state, reviews: action.reviews };

    case 'review/CREATE_REVIEW':
      console.log(action.review);
      return { ...state, reviews: state.reviews.concat(action.review) };

    case 'review/EDIT_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map((review) => {
          if (review.id === action.review.id) {
            return action.review;
          } else {
            return review;
          }
        }),
      };

    case 'review/DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.id),
      };

    default:
      break;
  }
  return state;
}
