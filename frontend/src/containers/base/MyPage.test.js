import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import MyPage from './MyPage';
import { getMockStore, history } from '../../test-utils/mock';

const mockStore = getMockStore(
  { user: { username: 'mock Username' }, isLoggedIn: true },
  { favoriteContents: [{ id: 1 }] },
  {
    groups: [
      {
        id: 1,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
      {
        id: 2,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
      {
        id: 3,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
      {
        id: 4,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
      {
        id: 5,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
      {
        id: 6,
        platform: 'netflix',
        title: 'mock Group',
        leader: 'mock Leader',
        membership: 'Premium',
        price: 9999,
        curMember: 1,
        maxMember: 4,
        duration: 0,
      },
    ],
  },
  {},
  {},
);

describe('<MyPage />', () => {
  let mockMyPage;

  beforeEach(() => {
    mockMyPage = (
      <Provider store={mockStore}>
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

  it('should render new groups when page button clicks', () => {
    const component = mount(mockMyPage);

    const wrapper = component.find('.mypage__grouplist ul li a');

    wrapper.at(2).simulate('click');

    expect(component.find('.group-item').length).toBe(1);
  });
});
