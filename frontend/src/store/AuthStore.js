import axios from 'axios';

const initialState = {
  loginError: '',
  signUpError: '',
  isLoggedIn: false,
};

const _getLoginStatus = (status) => {
  return { type: 'auth/GET_LOGIN_STATUS', status };
};

const _logIn = (user) => {
  return { type: 'auth/LOG_IN', user };
};

const _logOut = () => {
  return { type: 'auth/LOG_OUT' };
};

const _signUp = () => {
  return { type: 'auth/SIGN_UP' };
};

const _setLoginErrorMessage = (message) => {
  return { type: 'auth/SET_LOGIN_ERROR_MESSAGE', message };
};

const _setSignUpErrorMessage = (message) => {
  return { type: 'auth/SET_SIGN_UP_ERROR_MESSAGE', message };
};

export const getLoginStatus = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/user');
    dispatch(_getLoginStatus(res.data));
  } catch (e) {
    // TODO
  }
};

export const logIn = (userInfo) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/login', userInfo);
    dispatch(_logIn(res.data));
  } catch (e) {
    // TODO
    dispatch(_setLoginErrorMessage(e));
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await axios.get('/api/user/logout');
    dispatch(_logOut());
  } catch (e) {}
};

export const signUp = (userInfo) => async (dispatch) => {
  try {
    await axios.post('/api/user', userInfo);
    dispatch(_signUp());
  } catch (e) {
    // TODO
    dispatch(_setSignUpErrorMessage(e));
  }
};

// TODO: LocalStorage
export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/GET_LOGIN_STATUS':
      return { ...state, isLoggedIn: action.status };

    case 'auth/LOG_IN':
      // TODO set localStorage
      return state;

    case 'auth/LOG_OUT':
      // TODO delete localStorage?
      return { ...state, isLoggedIn: false };

    case 'auth/SET_LOGIN_ERROR_MESSAGE':
      return { ...state, loginError: action.message };

    case 'auth/SET_SIGN_UP_ERROR_MESSAGE':
      return { ...state, signUpError: action.message };

    default:
      break;
  }
  return state;
}
