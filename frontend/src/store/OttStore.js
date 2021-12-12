import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  otts: [],
  selectedOttPlan: [],
};
const _getOtts = (otts) => {
  return { type: 'ott/GET_OTTS', otts };
};
const _getOttPlan = (ottPlan) => {
  return { type: 'ott/GET_OTT_PLAN', ottPlan };
};
export const getOtts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/ott/');
    dispatch(_getOtts(res.data));
  } catch (e) {}
};
export const getOttPlan = (ott) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/ott/${ott}/`);
    dispatch(_getOttPlan(res.data));
  } catch (e) {
    dispatch(_getOttPlan(null));
  }
};

// TODO: LocalStorage
export default function OttReducer(state = initialState, action) {
  switch (action.type) {
    case 'ott/GET_OTTS':
      return { ...state, otts: action.otts };

    case 'ott/GET_OTT_PLAN':
      return { ...state, selectedOttPlan: action.ottPlan };

    default:
      break;
  }
  return state;
}
