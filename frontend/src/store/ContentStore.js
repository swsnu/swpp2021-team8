import axios from 'axios';

const initialState = {
  searchContents: [],
  favoriteContents: [],
  recommendationContents: [],
};

const _getSearchContents = (contents) => {
  return { type: 'content/GET_SEARCH_CONTENTS', contents };
};

const _getRecommendationContents = (contents) => {
  return { type: 'content/GET_RECOMMENDATION_CONTENTS', contents };
};

const _getFavoriteContents = (contents) => {
  return { type: 'content/GET_FAVORITE_CONTENTS', contents };
};

const _addFavoriteContent = (content) => {
  return { type: 'content/ADD_FAVORITE_CONTENT', content };
};

const _deleteFavoriteContent = (id) => {
  return { type: 'content/DELETE_FAVORITE_CONTENT', id };
};

export const getSearchContents = (query) => async (dispatch) => {
  try {
    const res = axios.get(`/api/content/${query}`);
    dispatch(_getSearchContents(res.data));
  } catch (e) {}
};

export const getRecommendationContents = (userId) => async (dispatch) => {
  try {
    const res = axios.get(`/api/content/${userId}/recommendation`);
    dispatch(_getRecommendationContents(res.data));
  } catch (e) {}
};

export const getFavoriteContents = (userId) => async (dispatch) => {
  try {
    const res = axios.get(`/api/content/${userId}/favorite`);
    dispatch(_getFavoriteContents(res.data));
  } catch (e) {}
};

export const addFavoriteContent = (userId, contentId) => async (dispatch) => {
  try {
    const res = axios.post(`/api/content/${userId}/favorite/${contentId}`);
    dispatch(_addFavoriteContent(res.data));
  } catch (e) {}
};

export const deleteFavoriteContent =
  (userId, contentId) => async (dispatch) => {
    try {
      await axios.delete(`/api/content/${userId}/favorite/${contentId}`);
      dispatch(_deleteFavoriteContent(contentId));
    } catch (e) {}
  };

export default function ContentReducer(state = initialState, action) {
  switch (action.type) {
    case 'content/GET_SEARCH_CONTENTS':
      return { ...state, searchContents: action.contents };

    case 'content/GET_RECOMMENDATION_CONTENTS':
      return { ...state, recommendationContents: action.contents };

    case 'content/GET_FAVORITE_CONTENT':
      return { ...state, favoriteContents: action.contents };

    case 'content/ADD_FAVORITE_CONTENT':
      return {
        ...state,
        favoriteContents: state.favoriteContents.concat(action.content),
      };

    case 'content/DELETE_FAVORITE_CONTENT':
      return {
        ...state,
        favoriteContents: state.favoriteContents.filter(
          (content) => content.id !== action.id,
        ),
      };

    default:
      break;
  }
  return state;
}
