import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import LoginPage from './LoginPage';
import { getMockStore, history } from '../../test-utils/mock';
import * as AuthReducer from '../../store/AuthStore';

const mockStore = getMockStore({}, {}, {}, {}, {});
const mockStoreError = getMockStore({ loginError: 'login Error' }, {}, {}, {}, {});

describe('<LoginPage />', () => {
  let mockLoginPage;

  beforeEach(() => {
    mockLoginPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={LoginPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    AuthReducer.logIn = jest.fn(() => () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockLoginPage);

    expect(component.find(LoginPage).length).toBe(1);
  });

  it('should change username state when user inputs username', () => {
    const component = mount(mockLoginPage);
    const usernameWrapper = component.find('#username-input');

    const testUsername = 'username test';

    usernameWrapper.simulate('change', { target: { value: testUsername } });

    expect(component.find('#username-input').props().value).toBe(
      testUsername,
    );
  });

  it('should change password state when user inputs password', () => {
    const component = mount(mockLoginPage);
    const passwordWrapper = component.find('#password-input');

    const testPassword = 'password test';

    passwordWrapper.simulate('change', { target: { value: testPassword } });

    expect(component.find('#password-input').props().value).toBe(
      testPassword,
    );
  });

  it('should be redirected to sign up page when user clicks Sign Up button', () => {
    const component = mount(mockLoginPage);
    const signUpButtonWrapper = component.find('#signup-button');

    signUpButtonWrapper.simulate('click');

    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/signup');
  });

  it('should dispatch login action when click login button', () => {
    const component = mount(mockLoginPage);
    const loginButtonWrapper = component.find('#login-button');

    component
      .find('#username-input')
      .simulate('change', { target: { value: 'swpp' } });
    component
      .find('#password-input')
      .simulate('change', { target: { value: 'iluvswpp' } });

    loginButtonWrapper.simulate('click');

    expect(AuthReducer.logIn).toHaveBeenCalledTimes(1);
    expect(AuthReducer.logIn).toHaveBeenCalledWith({
      username: 'swpp',
      password: 'iluvswpp',
    });
  });

  it('should renders loginError if state.auth.loginError exists', () => {
    mockLoginPage = (
      <Provider store={mockStoreError}>
        <ConnectedRouter history={history}>
          <Route path="/" component={LoginPage} exact />
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(mockLoginPage);

    expect(component.find('.login__body--icon').length).toBe(1);
  });
});
