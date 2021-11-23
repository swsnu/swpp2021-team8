import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import GroupDetailPage from './GroupDetailPage';
import { history } from '../../test-utils/mock';
import store from '../../store';

describe('<GroupDetailPage />', () => {
  let mockGroupDetailPage;

  beforeEach(() => {
    mockGroupDetailPage = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupDetailPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    // redux.useDispatch = jest.fn(() => () => {});
    // AuthReducer.logIn = jest.fn(() => () => {});
    // GroupReducer.getGroups = jest.fn(() => () => {});
    // localStorage.setItem('mainTab', 'group');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockGroupDetailPage);
    expect(component.find(GroupDetailPage).length).toBe(1);
  });

  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  xit('should set state well when join, quit button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#join-button').simulate('click');
    const wrapper = component.find('.people .content');
    // TODO
    expect(wrapper.text()).toBe('');
    component.find('#quit-button').simulate('click');
    expect(wrapper.text()).toBe('3');
  });
});
