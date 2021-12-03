import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import GroupEditPage from './GroupEditPage';
import { getMockStore, history } from '../../test-utils/mock';
import * as GroupReducer from '../../store/GroupStore';
import * as OttReducer from '../../store/OttStore';

jest.mock('../../components/base/FieldInfoItem', () => {
  return jest.fn(({ container, category, content, section }) => {
    return (
      <div className={'test__fieldInfoItem '.concat(category.toLowerCase())}>
        <div className="test__container">
          {container}
        </div>
        <div className="test__section">
          {section}
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

const mockGroup = {
  id: 1,
  name: 'name1',
  platform: 'Watcha',
  membership: 'Standard',
  cost: 10000,
  maxPeople: 4,
  currentPeople: 3,
  isPublic: true,
  password: 0,
  members: [
    {
      id: 1,
      username: 'member1',
    },
    {
      id: 2,
      username: 'member2',
    },
    {
      id: 3,
      username: 'member3',
    },
  ],
  accountBank: 'bank',
  accountNumber: 'number',
  accountName: 'name',
  description: 'description',
  payday: 5,
  leader: {
    id: 1,
    username: 'member1',
  },
};
const mockStore = getMockStore(
  {
    user: {
      id: 1,
      username: 'member1',
    },
  },
  {},
  {
    groups: [
      mockGroup,
    ],
    selectedGroup: mockGroup,
  },
  {},
  {},
);
const mockStoreNotSelected = getMockStore(
  {
    user: {},
  },
  {},
  {
    groups: [],
    selectedGroup: {},
  },
  {},
  {},
);
const mockStoreNotLeader = getMockStore(
  {
    user: {
      id: 2,
      username: 'member2',
    },
  },
  {},
  {
    groups: [
      mockGroup,
    ],
    selectedGroup: mockGroup,
  },
  {},
  {},
);
describe('<GroupEditPage />', () => {
  let mockGroupEditPage;

  beforeEach(() => {
    mockGroupEditPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupEditPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    GroupReducer.editGroup = jest.fn(() => {});
    OttReducer.getOtts = jest.fn(() => {});
    OttReducer.getOttPlan = jest.fn(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockGroupEditPage);
    expect(component.find(GroupEditPage).length).toBe(1);
  });

  it('should goback when user is not the leader of the group', () => {
    mount(
      <Provider store={mockStoreNotLeader}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupEditPage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });
  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupEditPage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should be redirected to the main page when cancel button is clicked', () => {
    const component = mount(mockGroupEditPage);
    component.find('#groupedit-cancel-button').simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  it('should check password matchs', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#groupedit-public-input')
      .simulate('change', { target: { checked: true } });
    expect(component.find('#groupedit-password-input').length).toBe(1);
    component
      .find('#groupedit-password-input')
      .simulate('change', { target: { value: '1234' } });
    component
      .find('#groupedit-password-confirm-input')
      .simulate('change', { target: { value: '1234' } });
    expect(component.find(GroupEditPage, '.isequal').length).toBe(1);
  });

  it('should check password does not match', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#groupedit-public-input')
      .simulate('change', { target: { checked: true } });
    expect(component.find('#groupedit-password-input').length).toBe(1);
    component
      .find('#groupedit-password-input')
      .simulate('change', { target: { value: '1234' } });
    component
      .find('#groupedit-password-confirm-input')
      .simulate('change', { target: { value: '1235' } });
    expect(component.find(GroupEditPage, '.isnotequal').length).toBe(1);
  });

  it('should render platform, membership, people, cost well', () => {
    const component = mount(mockGroupEditPage);
    expect(component.find('.platform__text').length).toBe(1);
    expect(component.find('.platform__text').text()).toEqual('Watcha');
    expect(component.find('.membership__text').length).toBe(1);
    expect(component.find('.membership__text').text()).toEqual('Standard');
    expect(component.find('.people__text').length).toBe(1);
    expect(component.find('.people__text').text()).toEqual('4');
    expect(component.find('.cost__text').length).toBe(1);
    expect(component.find('.cost__text').text()).toEqual('2500 Won');
  });

  it('should not render membership info when group is not valid', () => {
    const component = mount(
      <Provider store={mockStoreNotSelected}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupEditPage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    expect(component.find('.platform__text').text()).toEqual('');
    expect(component.find('.membership__text').text()).toEqual('');
    expect(component.find('.people__text').text()).toBe('0');
    expect(component.find('.cost__text').text()).toBe('0 Won');
  });

  it('should set title, description, account well, and edit group well', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#groupedit-title-input')
      .simulate('change', { target: { value: 'edited' } });
    component
      .find('#groupedit-description-input')
      .simulate('change', { target: { value: 'description1' } });
    component
      .find('#groupedit-account-bank-select')
      .simulate('change', { target: { value: 'bank1' } });
    component
      .find('#groupedit-account-number-input')
      .simulate('change', { target: { value: 'number1' } });
    component
      .find('#groupedit-account-name-input')
      .simulate('change', { target: { value: 'name1' } });
    component
      .find('#edit-group-button')
      .simulate('click');
    expect(GroupReducer.editGroup).toHaveBeenCalledTimes(1);
  });
});
