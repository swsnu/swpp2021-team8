import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import GroupCreatePage from './GroupCreatePage';
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

const mockStore = getMockStore(
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

describe('<GroupCreatePage />', () => {
  let mockGroupCreatePage;

  beforeEach(() => {
    mockGroupCreatePage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupCreatePage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    GroupReducer.createGroup = jest.fn(() => {});
    OttReducer.getOtts = jest.fn(() => {});
    OttReducer.getOttPlan = jest.fn(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockGroupCreatePage);
    expect(component.find(GroupCreatePage).length).toBe(1);
  });

  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should be redirected to the main page when cancel button is clicked', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#cancel-button').simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  it('should check password matchs', () => {
    const component = mount(mockGroupCreatePage);
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
    expect(component.find(GroupCreatePage, '.isequal').length).toBe(1);
  });

  it('should check password does not match', () => {
    const component = mount(mockGroupCreatePage);
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
    expect(component.find(GroupCreatePage, '.isnotequal').length).toBe(1);
  });

  it('should set platform, membership well', () => {
    const component = mount(mockGroupCreatePage);
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
          <Route path="/" component={GroupCreatePage} exact />
        </ConnectedRouter>
      </Provider>,
    );
    expect(component.find('.people__text').text()).toBe('0');
    expect(component.find('.cost__text').text()).toBe('0 Won');
  });

  it('should set title, description, account, payday well, and create group well', () => {
    const component = mount(mockGroupCreatePage);
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
      .find('#create-group-button')
      .simulate('click');
    expect(GroupReducer.createGroup).toHaveBeenCalledTimes(1);
  });
});
