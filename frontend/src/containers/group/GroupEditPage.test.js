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
  groups: [],
  selectedGroup: {
      id: 1,
      name: 'name1',
      platform: 'Watcha',
      membership: 'Standard',
      cost: 10000,
      maxPeople: 4,
      currentPeople: 3,
      members: [
          {
              id: 1,
              member: 'member1',
          },
          {
              id: 2,
              member: 'member2',
          },
          {
              id: 3,
              member: 'member3',
          },
      ],
      accountBank: 'bank',
      accountNumber: 'number',
      accountName: 'name',
      description: 'description',
      payday: 5,
      leader: {
          id: 1,
          member: 'member1',
      },
  },
};
const mockStore = getMockStore(
  {},
  {},
  {
    groups: [
        mockGroup,
    ],
    selectedGroup: mockGroup,
  },
  {
    otts: [
      {
        id: 1,
        name: 'Netflix',
      },
      {
        id: 2,
        name: 'test2',
      },
      {
        id: 3,
        name: 'test3',
      },
    ],
    selectedOttPlan: {
      id: 1,
      platform: 'Netflix',
      membership: 'Premium',
      maxPeople: 4,
      cost: 10000,
    },
  },
  {},
);

const mockStoreNotSelected = getMockStore(
  {},
  {},
  {
    groups: [],
    selectedGroup: {},
  },
  {
    otts: [
      {
        id: 1,
        name: 'Netflix',
      },
      {
        id: 2,
        name: 'test2',
      },
      {
        id: 3,
        name: 'test3',
      },
    ],
    selectedOttPlan: {},
  },
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

  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupEditPage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should be redirected to the main page when cancel button is clicked', () => {
    const component = mount(mockGroupEditPage);
    component.find('#cancel-button').simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  it('should check password matchs', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#public-input')
      .simulate('change', { target: { checked: true } });
    expect(component.find('#password-input').length).toBe(1);
    component
      .find('#password-input')
      .simulate('change', { target: { value: '1234' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: '1234' } });
    expect(component.find(GroupEditPage, '.isequal').length).toBe(1);
  });

  it('should check password does not match', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#public-input')
      .simulate('change', { target: { checked: true } });
    expect(component.find('#password-input').length).toBe(1);
    component
      .find('#password-input')
      .simulate('change', { target: { value: '1234' } });
    component
      .find('#password-confirm-input')
      .simulate('change', { target: { value: '1235' } });
    expect(component.find(GroupEditPage, '.isnotequal').length).toBe(1);
  });

  it('should set platform, membership well', () => {
    const component = mount(mockGroupEditPage);
    expect(OttReducer.getOttPlan).toHaveBeenCalledTimes(1);
    component
      .find('#netflix-logo-button')
      .simulate('change', { target: { value: 'Netflix' } });
    expect(component.find('.logo.checked').length).toBe(1);
    expect(OttReducer.getOttPlan).toHaveBeenCalledTimes(2);
    component
      .find('#membership-select')
      .simulate('change', { target: { value: 'Premium' } });
    expect(OttReducer.getOttPlan).toHaveBeenCalledTimes(3);
  });

  it('should not set people and cost when ott is not valid', () => {
    const component = mount(
      <Provider store={mockStoreNotSelected}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupEditPage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    expect(component.find('.people__text').text()).toBe('0');
    expect(component.find('.cost__text').text()).toBe('0 Won');
  });

  it('should set title, description, account, payday well, and edit group well', () => {
    const component = mount(mockGroupEditPage);
    component
      .find('#netflix-logo-button')
      .simulate('change', { target: { value: 'Netflix' } });
    expect(component.find('.logo.checked').length).toBe(1);
    component
      .find('#membership-select')
      .simulate('change', { target: { value: 'Premium' } });
    component
      .find('#group-title-input')
      .simulate('change', { target: { value: 'title1' } });
    component
      .find('#description-input')
      .simulate('change', { target: { value: 'description1' } });
    component
      .find('#account-bank-select')
      .simulate('change', { target: { value: 'bank1' } });
    component
      .find('#account-number-input')
      .simulate('change', { target: { value: 'number1' } });
    component
      .find('#account-name-input')
      .simulate('change', { target: { value: 'name1' } });
    component
      .find('#payday-select')
      .simulate('change', { target: { value: 3 } });
    component
      .find('#edit-group-button')
      .simulate('click');
    expect(GroupReducer.editGroup).toHaveBeenCalledTimes(1);
  });
});
