import React from 'react';
import { mount } from 'enzyme';
import MyPage from './MyPage';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../../test-utils/mock';
import store from '../../store'

describe('<MyPage />', () => {
  let mockMyPage;

  beforeEach(() => {
    mockMyPage = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MyPage} exact />
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockMyPage);
    expect(component.find(MyPage).length).toBe(1);
  });
});