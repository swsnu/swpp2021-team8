import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import GroupDetailPage from './GroupDetailPage';
import { getMockStore, history } from '../../test-utils/mock';
import * as GroupReducer from '../../store/GroupStore';

jest.mock('../../components/base/FieldInfoItem', () => {
  return jest.fn(({ container, category, content }) => {
    return (
      <div className={'test__fieldInfoItem '.concat(category.toLowerCase())}>
        <div className="test__container">
          {container}
        </div>
        <div className="test__category">
          {category}
        </div>
        <div className="test__content">
          {content}
        </div>
      </div>
    );
  });
});

const mockStore = getMockStore(
  {
    user: {
      id: 1,
      username: 'user1',
    },
  },
  {},
  {
    groups: [
      {
        id: 1,
        name: 'test1',
        platform: 'Netflix',
        membership: 'Premium',
        cost: 10000,
        maxPeople: 4,
        currentPeople: 2,
        members: [
          {
            id: 1,
            username: 'user1',
          },
          {
            id: 2,
            username: 'user2',
          },
        ],
        accountBank: 'bank',
        accountNumber: 'number',
        accountName: 'name',
        description: 'description',
        payday: 3,
        leader: {
          id: 1,
          username: 'user1',
        },
      },
    ],
    selectedGroup: {
      id: 1,
      name: 'test1',
      platform: 'Netflix',
      membership: 'Premium',
      cost: 10000,
      maxPeople: 4,
      currentPeople: 2,
      members: [
        {
          id: 1,
          username: 'user1',
        },
        {
          id: 2,
          username: 'user2',
        },
      ],
      accountBank: 'bank',
      accountNumber: 'number',
      accountName: 'name',
      description: 'description',
      payday: 3,
      leader: {
        id: 1,
        username: 'user1',
      },
    },
  },
  {},
  {},
);
const mockStoreJoin = getMockStore(
  {
    user: {
      id: 3,
      username: 'user3',
    },
  },
  {},
  {
    groups: [
      {
        id: 1,
        name: 'test1',
        platform: 'Netflix',
        membership: 'Premium',
        cost: 10000,
        maxPeople: 4,
        currentPeople: 2,
        members: [
          {
            id: 1,
            username: 'user1',
          },
          {
            id: 2,
            username: 'user2',
          },
        ],
        accountBank: 'bank',
        accountNumber: 'number',
        accountName: 'name',
        description: 'description',
        payday: 3,
        leader: {
          id: 1,
          username: 'user1',
        },
      },
    ],
    selectedGroup: {
      id: 1,
      name: 'test1',
      platform: 'Netflix',
      membership: 'Premium',
      cost: 10000,
      maxPeople: 4,
      currentPeople: 2,
      members: [
        {
          id: 1,
          username: 'user1',
        },
        {
          id: 2,
          username: 'user2',
        },
      ],
      accountBank: 'bank',
      accountNumber: 'number',
      accountName: 'name',
      description: 'description',
      payday: 3,
      leader: {
        id: 1,
        username: 'user1',
      },
    },
  },
  {},
  {},
);
const mockStoreNull = getMockStore(
  {
    user: {
      id: 1,
      username: 'user1',
    },
  },
  {},
  {
    groups: [],
    selectedGroup: {},
  },
  {},
  {},
);

describe('<GroupDetailPage />', () => {
  let mockGroupDetailPage;

  beforeEach(() => {
    mockGroupDetailPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupDetailPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    GroupReducer.getGroupDetail = jest.fn(() => {});
    GroupReducer.addUserToGroup = jest.fn(() => {});
    GroupReducer.deleteUserFromGroup = jest.fn(() => {});
    GroupReducer.deleteGroup = jest.fn(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockGroupDetailPage);
    expect(component.find(GroupDetailPage).length).toBe(1);
  });

  it('should render well before get group', () => {
    const component = mount(
      <Provider store={mockStoreNull}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupDetailPage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    expect(component.find(GroupDetailPage).length).toBe(1);
  });

  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should set state well when quit button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#quit-button').simulate('click');
    expect(GroupReducer.deleteUserFromGroup).toHaveBeenCalledTimes(1);
  });

  it('should set state well when join button is clicked', () => {
    const component = mount(
      <Provider store={mockStoreJoin}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupDetailPage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    component.find('#join-button').simulate('click');
    expect(GroupReducer.addUserToGroup).toHaveBeenCalledTimes(1);
  });

  it('should push well when edit button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#edit-button').simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  it('should act properly when delete button is clicked', () => {
    const component = mount(mockGroupDetailPage);
    component.find('#delete-button').simulate('click');
    expect(GroupReducer.deleteGroup).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledTimes(1);
  });
});
