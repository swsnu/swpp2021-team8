import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  searchContents: [],
  favoriteContents: [],
  isFavorite: false,
  recommendationContents: [],
  trendingContents: [],
  selectedContent: {},
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

const _getIsFavoriteContent = (isFavorite) => {
  return { type: 'content/GET_IS_FAVORITE_CONTENT', isFavorite };
};

const _addFavoriteContent = (content) => {
  return {
    type: 'content/ADD_FAVORITE_CONTENT',
    id: content.id,
    favoriteCount: content.favorite_cnt,
  };
};

const _deleteFavoriteContent = (content) => {
  return {
    type: 'content/DELETE_FAVORITE_CONTENT',
    id: content.id,
    favoriteCount: content.favorite_cnt,
  };
};

const _getTrendingContents = (contents) => {
  return { type: 'content/GET_TRENDING_CONTENTS', contents };
};

const _getContentDetail = (content) => {
  return { type: 'content/GET_CONTENT_DETAIL', content };
};

export const getSearchContents = (query) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/content/search/${query}/`);
    dispatch(_getSearchContents(res.data));
  } catch (e) {}
};

export const getContentDetail = (contentId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/content/${contentId}/`);
    dispatch(_getContentDetail(res.data));
  } catch (e) {}
};

export const getRecommendationContents = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/content/${userId}/recommendation/`);
    dispatch(_getRecommendationContents(res.data));
  } catch (e) {}
};

export const getFavoriteContents = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/content/${userId}/favorite/`);
    dispatch(_getFavoriteContents(res.data));
  } catch (e) {}
};

export const getIsFavoriteContent = (userId, contentId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/content/${userId}/favorite/${contentId}/`,
    );
    dispatch(_getIsFavoriteContent(res.data));
  } catch (e) {}
};

export const addFavoriteContent = (userId, contentId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/api/content/${userId}/favorite/${contentId}/`,
    );
    dispatch(_addFavoriteContent(res.data));
  } catch (e) {}
};

export const deleteFavoriteContent =
  (userId, contentId) => async (dispatch) => {
    try {
      const res = await axios.delete(
        `/api/content/${userId}/favorite/${contentId}/`,
      );
      dispatch(_deleteFavoriteContent(res.data));
    } catch (e) {}
  };

export const getTrendingContents = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/content/trending/');
    dispatch(_getTrendingContents(res.data));
  } catch (e) {}
};

export default function ContentReducer(state = initialState, action) {
  switch (action.type) {
    case 'content/GET_SEARCH_CONTENTS':
      return { ...state, searchContents: action.contents };

    case 'content/GET_RECOMMENDATION_CONTENTS':
      return { ...state, recommendationContents: action.contents };

    case 'content/GET_FAVORITE_CONTENTS':
      return { ...state, favoriteContents: action.contents };

    case 'content/GET_TRENDING_CONTENTS':
      return { ...state, trendingContents: action.contents };

    case 'content/GET_IS_FAVORITE_CONTENT':
      return { ...state, isFavorite: action.isFavorite.is_favorite };

    case 'content/ADD_FAVORITE_CONTENT':
      return {
        ...state,
        selectedContent: {
          ...state.selectedContent,
          favorite_cnt: action.favoriteCount,
        },
        favoriteContents: state.favoriteContents.concat(action.id),
      };

    case 'content/DELETE_FAVORITE_CONTENT':
      return {
        ...state,
        selectedContent: {
          ...state.selectedContent,
          favorite_cnt: action.favoriteCount,
        },
        favoriteContents: state.favoriteContents.filter(
          (content) => content.id !== action.id,
        ),
      };

    case 'content/GET_CONTENT_DETAIL':
      return {
        ...state,
        selectedContent: action.content,
      };

    default:
      break;
  }
  return state;
}
