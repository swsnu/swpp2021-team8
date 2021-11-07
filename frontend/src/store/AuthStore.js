import axios from 'axios';

const initialState = {
  loginError: '',
  signUpError: '',
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')),
};

const _getLoginStatus = ({ isLoggedIn }) => {
  return { type: 'auth/GET_LOGIN_STATUS', status: isLoggedIn };
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
    const res = await axios.get('/api/user/');
    dispatch(_getLoginStatus(res.data));
  } catch (e) {}
};

export const logIn = (userInfo) => async (dispatch) => {
  try {
    const res = await axios.post('/api/login/', userInfo);
    dispatch(_logIn(res.data));
  } catch (e) {
    // TODO
    switch (e.response.status) {
      case 400: // Bad request
        dispatch(_setLoginErrorMessage('Key Error!'));
        break;
      case 401: // Not authorized
        dispatch(_setLoginErrorMessage('Not Athorized'));
        break;
      default:
        dispatch(_setLoginErrorMessage('Something Error'));
        break;
    }
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await axios.get('/api/logout/');
    dispatch(_logOut());
  } catch (e) {}
};

export const signUp = (userInfo) => async (dispatch) => {
  try {
    await axios.post('/api/signup/', userInfo);
    dispatch(_signUp());
  } catch (e) {
    // TODO
    switch (e.response.status) {
      case 400: // Bad request
        dispatch(_setSignUpErrorMessage('Key Error!'));
        break;
      case 405: // Not allowed request
        dispatch(_setSignUpErrorMessage('Not allowed request'));
        break;
      case 409: // IntegrityError
        dispatch(_setSignUpErrorMessage('Integrity Error'));
        break;
      default:
        dispatch(_setSignUpErrorMessage('Something Error'));
        break;
    }
  }
};

// TODO: LocalStorage
export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/GET_LOGIN_STATUS':
      localStorage.setItem('isLoggedIn', JSON.stringify(action.status));
      return { ...state, isLoggedIn: action.status };

    case 'auth/LOG_IN':
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      return { ...state, isLoggedIn: true, loginError: '', signUpError: '' };

    case 'auth/LOG_OUT':
      localStorage.setItem('isLoggedIn', JSON.stringify(false));
      return { ...state, isLoggedIn: false, loginError: '', signUpError: '' };

    case 'auth/SET_LOGIN_ERROR_MESSAGE':
      return { ...state, loginError: action.message };

    case 'auth/SET_SIGN_UP_ERROR_MESSAGE':
      return { ...state, signUpError: action.message };

    default:
      break;
  }
  return state;
}
