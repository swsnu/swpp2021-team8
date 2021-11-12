import React from 'react';
import { mount } from 'enzyme';
import MainPage from './MainPage';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { getMockStore, history } from '../../test-utils/mock';
import * as AuthReducer from '../../store/AuthStore';
import * as GroupReducer from '../../store/GroupStore';

jest.mock('../../components/group/GroupListItem', () => {
  return jest.fn(({ group }) => {
    return (
      <>
        <div className="group-item">
          <div className="group-item__platform">{group.platform}</div>
          <div className="group-item__title">
            <span className="group-item__title--title">{group.title}</span>
            <span className="group-item__title--creator">{group.leader}</span>
          </div>
          <div className="group-item__membership">
            <span className="group-item__membership--membership">
              {group.membership}
            </span>
            <span className="group-item__membership--price">{group.price}</span>
          </div>
          <div className="group-item__member">{`${group.curMember}/${group.maxMember}`}</div>
          <div className="group-item__duration">{group.duration}</div>
        </div>
      </>
    );
  });
});

jest.mock('../../components/content/ContentListItem', () => {
  return jest.fn(({ content }) => {
    return (
      <>
        <div>{content.id}</div>
      </>
    );
  });
});

const mockStore = getMockStore(
  { isLoggedIn: true },
  {
    recommendationContents: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ],
    trendingContents: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ],
  },
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
    ],
  },
  {},
);

describe('<MainPage /> GroupTab', () => {
  let mockMainPage;

  beforeEach(() => {
    mockMainPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    AuthReducer.logIn = jest.fn(() => () => {});
    GroupReducer.getGroups = jest.fn(() => () => {});
    localStorage.setItem('mainTab', 'group');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockMainPage);

    expect(component.find(MainPage).length).toBe(1);
  });

  it('should render group when mainTab in localStorage does not exist', () => {
    localStorage.setItem('mainTab', '');
    mockMainPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(mockMainPage);

    expect(component.find('.main__header__active').text()).toBe('Group');
  });

  it('should change tab when click each other', () => {
    const component = mount(mockMainPage);
    const wrapper = component.find('.main__header__tab');

    wrapper.at(0).simulate('click');

    expect(component.find('.main__header__active').text()).toBe('Group');

    wrapper.at(1).simulate('click');

    expect(component.find('.main__header__active').text()).toBe('Content');
  });

  it('should be redirected to CreateGroupPage when button is clicked', () => {
    const component = mount(mockMainPage);

    component.find('#create-group-button').simulate('click');

    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/group/create');
  });

  it('should set group search input with user input', () => {
    const component = mount(mockMainPage);

    component
      .find('#group-search-input')
      .simulate('change', { target: { value: 'mockInput' } });

    expect(component.find('#group-search-input').props()['value']).toBe(
      'mockInput',
    );
  });

  it('should set change ott filter state when filter is clicked', () => {
    const component = mount(mockMainPage);
    const wrapper = component.find('.main__group-filter__ott__option__button');

    const expectedResult = [
      { ott: 'netflix', membership: 'basic' },
      { ott: 'netflix', membership: 'premium' },
      { ott: 'watcha', membership: 'basic' },
      { ott: 'watcha', membership: 'standard' },
      { ott: 'watcha', membership: 'premium' },
      { ott: 'tving', membership: 'basic' },
    ];

    for (let i = 0; i < wrapper.length; ++i) {
      wrapper.at(i).simulate('click');
      expect(
        component
          .find('.main__group-filter__ott__option__button--active')
          .props()['data-ott'],
      ).toBe(expectedResult[i].ott);
      expect(
        component
          .find('.main__group-filter__ott__option__button--active')
          .props()['data-membership'],
      ).toBe(expectedResult[i].membership);
      wrapper.at(i).simulate('click');
    }
  });

  it('should contain "name" field in query', () => {
    const component = mount(mockMainPage);

    component
      .find('#group-search-input')
      .simulate('change', { target: { value: 'mockInput' } });

    component.find('#group-search-button').simulate('click');

    expect(GroupReducer.getGroups).toHaveBeenNthCalledWith(2, 'name=mockInput');
  });

  it('should contain "ott" field in query', () => {
    const component = mount(mockMainPage);
    const wrapper = component.find('.main__group-filter__ott__option__button');

    const ottList = [
      { ott: 'netflix', membership: 'basic' },
      { ott: 'netflix', membership: 'premium' },
      { ott: 'watcha', membership: 'basic' },
      { ott: 'watcha', membership: 'standard' },
      { ott: 'watcha', membership: 'premium' },
      { ott: 'tving', membership: 'basic' },
    ];

    for (let i = 0; i < wrapper.length; ++i) {
      wrapper.at(i).simulate('click');
    }

    component.find('#group-search-button').simulate('click');

    expect(GroupReducer.getGroups).toHaveBeenNthCalledWith(
      2,
      ottList
        .map((value) => {
          return `ott=${value.ott}__${value.membership}`;
        })
        .join('&'),
    );
  });

  it('should change visibility of filtered component when clicks', () => {
    const component = mount(mockMainPage);

    component.find('#group-filter-button').simulate('click');

    expect(component.find('.main__group-filter__visible').length).toBe(1);
  });
});