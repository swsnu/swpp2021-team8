import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  loginError: '',
  signUpError: '',
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')),
  user: {
    id: '',
    username: '',
    notDeletedGroupCount: 0,
    deletedGroupCount: 0,
  },
};

const _getLoginStatus = ({
  isLoggedIn,
  id,
  username,
  notDeletedGroupCount,
  deletedGroupCount,
}) => {
  return {
    type: 'auth/GET_LOGIN_STATUS',
    status: isLoggedIn,
    id,
    username,
    notDeletedGroupCount,
    deletedGroupCount,
  };
};

const _logIn = () => {
  return { type: 'auth/LOG_IN' };
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
    await axios.post('/api/user/login/', userInfo);
    dispatch(_logIn());
  } catch (e) {
    switch (e.response.status) {
      case 401: // Username or password is wrong
        dispatch(_setLoginErrorMessage('Check your username/password'));
        break;
      default:
        dispatch(_setLoginErrorMessage('Something is wrong'));
        break;
    }
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await axios.get('/api/user/logout/');
    dispatch(_logOut());
  } catch (e) {}
};

export const signUp = (userInfo) => async (dispatch) => {
  try {
    await axios.post('/api/user/signup/', userInfo);
    dispatch(_signUp());

    return true;
  } catch (e) {
    // TODO
    switch (e.response.status) {
      case 409: // Username already exists
        dispatch(_setSignUpErrorMessage('Username already exists'));
        break;
      default:
        dispatch(_setSignUpErrorMessage('Something is wrong'));
        break;
    }
    return false;
  }
};

// TODO: LocalStorage
export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/GET_LOGIN_STATUS':
      localStorage.setItem('isLoggedIn', JSON.stringify(action.status));
      return {
        ...state,
        isLoggedIn: action.status,
        user: {
          id: action.id,
          username: action.username,
          notDeletedGroupCount: action.notDeletedGroupCount,
          deletedGroupCount: action.deletedGroupCount,
        },
      };

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
