import axios from 'axios';

const initialState = {
  otts: [],
  selectedOttPlan: {},
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
export const getOttPlan = (ottPlatform, ottMembership) => async (dispatch) => {
  try {
    const ottPlan = `${ottPlatform.name.toLowerCase()}_${ottMembership.toLowerCase()}`;
    const res = await axios.get(`/api/ott/${ottPlan}/`)
      .catch(() => { dispatch(_getOttPlan(null)); });
    dispatch(_getOttPlan(res.data));
  } catch (e) {}
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
