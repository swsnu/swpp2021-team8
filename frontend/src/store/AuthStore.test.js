import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import auth, { getLoginStatus, logIn, logOut, signUp } from './AuthStore';

const store = createStore(auth, applyMiddleware(thunk));

class TestError extends Error {
  constructor(status) {
    super();
    this.response = { status };
  }
}

describe('AuthStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should set isLoggedIn as return of server', async () => {
    axios.get = jest.fn(async () => {
      return { data: { isLoggedIn: true } };
    });

    await store.dispatch(getLoginStatus());
    const state = store.getState();

    expect(state.isLoggedIn).toBe(true);
  });

  it('should set isLoggedIn true when users try to log in', async () => {
    axios.post = jest.fn(async () => {
      return true;
    });

    await store.dispatch(logIn());
    const state = store.getState();

    expect(state.isLoggedIn).toBe(true);
  });

  it('should set proper text to LoginError when it gets error from server', async () => {
    axios.post = jest.fn(async () => {
      throw new TestError(401);
    });

    await store.dispatch(logIn());
    const state = store.getState();

    expect(state.loginError).toBe('Check your username/password');

    axios.post = jest.fn(async () => {
      throw new TestError(500);
    });

    await store.dispatch(logIn());
    const newState = store.getState();

    expect(newState.loginError).toBe('Something is wrong');
  });

  it('should logout properly', async () => {
    axios.get = jest.fn(async () => {});

    await store.dispatch(logOut());
    const state = store.getState();

    expect(localStorage.getItem('isLoggedIn')).toBe(JSON.stringify(false));
    expect(state.isLoggedIn).toBe(false);
    expect(state.loginError).toBe('');
    expect(state.signUpError).toBe('');
  });

  it('should call post function to server with userInfo', async () => {
    axios.post = jest.fn(async () => {});

    await store.dispatch(
      signUp({ username: 'username', password: 'password' }),
    );

    expect(axios.post).toHaveBeenCalledWith('/api/signup/', {
      username: 'username',
      password: 'password',
    });
  });

  it('should set proper text to signUpError when it gets error from server', async () => {
    axios.post = jest.fn(async () => {
      throw new TestError(409);
    });

    await store.dispatch(signUp());
    const state = store.getState();

    expect(state.signUpError).toBe('Username already exists');

    axios.post = jest.fn(async () => {
      throw new TestError(500);
    });

    await store.dispatch(signUp());
    const newState = store.getState();

    expect(newState.signUpError).toBe('Something is wrong');
  });
});
