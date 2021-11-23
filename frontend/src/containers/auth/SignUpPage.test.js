import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getMockStore, history } from '../../test-utils/mock';
import * as AuthReducer from '../../store/AuthStore';
import SignUpPage from './SignUpPage';

const mockStore = getMockStore({}, {}, {}, {});
const mockStoreError = getMockStore({ signUpError: 'SignUpError' }, {}, {}, {});

describe('<SignUp />', () => {
  let mockSignUpPage;

  beforeEach(() => {
    mockSignUpPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={SignUpPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => async () => {
      return true;
    });
    AuthReducer.signUp = jest.fn(() => () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockSignUpPage);

    expect(component.find(SignUpPage).length).toBe(1);
  });

  it('should render FaTimesCircle if passwords are not same', () => {
    const component = mount(mockSignUpPage);

    component
      .find('#password-input')
      .simulate('change', { target: { value: 'password1' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: 'password2' } });

    expect(component.find(FaCheckCircle).length).toBe(1);
    expect(component.find(FaTimesCircle).length).toBe(1);
  });

  it('should change username if username input changes', () => {
    const component = mount(mockSignUpPage);

    const testUsername = 'testUsername';

    component
      .find('#username-input')
      .simulate('change', { target: { value: testUsername } });

    expect(component.find('#username-input').props().value).toBe(testUsername);
  });

  it('should dispatch action and return true when create account button is clicked', () => {
    const component = mount(mockSignUpPage);

    component
      .find('#username-input')
      .simulate('change', { target: { value: 'username' } });

    component
      .find('#password-input')
      .simulate('change', { target: { value: 'password1' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: 'password1' } });

    const createAccountButtonWrapper = component.find('#create-account-button');
    createAccountButtonWrapper.simulate('click');

    expect(AuthReducer.signUp).toHaveBeenCalledTimes(1);
    expect(AuthReducer.signUp).toHaveBeenCalledWith({
      username: 'username',
      password: 'password1',
    });
  });

  it('should dispatch action and return false when create account button is clicked', () => {
    redux.useDispatch = jest.fn(() => async () => {
      return false;
    });
    const component = mount(mockSignUpPage);

    component
      .find('#username-input')
      .simulate('change', { target: { value: 'username' } });

    component
      .find('#password-input')
      .simulate('change', { target: { value: 'password1' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: 'password1' } });

    const createAccountButtonWrapper = component.find('#create-account-button');
    createAccountButtonWrapper.simulate('click');

    expect(AuthReducer.signUp).toHaveBeenCalledTimes(1);
    expect(AuthReducer.signUp).toHaveBeenCalledWith({
      username: 'username',
      password: 'password1',
    });
  });

  it('should not dispatch action when create account button is clicked and password is not valid or equal', () => {
    const component = mount(mockSignUpPage);

    component
      .find('#username-input')
      .simulate('change', { target: { value: 'username' } });

    component
      .find('#password-input')
      .simulate('change', { target: { value: 'password1' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: 'password2' } });

    const createAccountButtonWrapper = component.find('#create-account-button');
    createAccountButtonWrapper.simulate('click');

    expect(AuthReducer.signUp).toHaveBeenCalledTimes(0);
  });

  it('should render signUpError if signUpError exists', () => {
    mockSignUpPage = (
      <Provider store={mockStoreError}>
        <ConnectedRouter history={history}>
          <Route path="/" component={SignUpPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(mockSignUpPage);

    const wrapper = component.find('.signup__body--icon');

    expect(wrapper.length).toBe(3);
    expect(wrapper.at(2).text()).toBe('SignUpError');
  });
});
