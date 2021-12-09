import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import * as AuthReducer from './store/AuthStore';
import App from './App';
import { getMockStore, history } from './test-utils/mock';

const mockStore = getMockStore(
  {
    isLoggedIn: true,
    user: {
      id: 1,
      username: 'user1',
      notDeletedGroupCount: 0,
      deletedGroupCount: 0,
    },
  },
  {},
  { groups: [] },
  {},
  {},
);

describe('App', () => {
  let app;

  beforeEach(() => {
    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
    redux.useDispatch = jest.fn(() => () => {});
    AuthReducer.getLoginStatus = jest.fn(() => {});
    AuthReducer.logOut = jest.fn(() => {});
  });

  it('should render App properly', () => {
    const component = mount(app);

    expect(component.find(App).length).toBe(1);
  });

  it('should logout properly', () => {
    const component = mount(app);

    component.find('#logout-button').simulate('click');

    expect(AuthReducer.logOut).toHaveBeenCalledTimes(1);
  });
});
