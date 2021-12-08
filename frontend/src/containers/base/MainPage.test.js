import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import MainPage from './MainPage';
import { getMockStore, history } from '../../test-utils/mock';
import * as AuthReducer from '../../store/AuthStore';
import * as GroupReducer from '../../store/GroupStore';
import * as ContentReducer from '../../store/ContentStore';

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
        <div className="content-list-item">{content.id}</div>
      </>
    );
  });
});

const mockStore = getMockStore(
  { isLoggedIn: true },
  {
    searchContents: [],
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
  {},
);

const mockPaginationStore = getMockStore(
  { isLoggedIn: true },
  {
    searchContents: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ],
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
      {
        id: 7,
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

    expect(component.find('#group-search-input').props().value).toBe(
      'mockInput',
    );
  });

  it('should set change ott filter state when filter is clicked', () => {
    const component = mount(mockMainPage);
    const wrapper = component.find('.main__group-filter__ott__option__button');

    const expectedResult = [
      { ott: 'netflix', membership: 'basic' },
      { ott: 'netflix', membership: 'standard' },
      { ott: 'netflix', membership: 'premium' },
      { ott: 'watcha', membership: 'premium' },
      { ott: 'tving', membership: 'standard' },
      { ott: 'tving', membership: 'premium' },
      { ott: 'youtube', membership: 'premium' },
      { ott: 'disney', membership: 'basic' },
      { ott: 'coupangPlay', membership: 'basic' },
      { ott: 'wavve', membership: 'standard' },
      { ott: 'wavve', membership: 'premium' },
    ];

    for (let i = 0; i < wrapper.length; i += 1) {
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
      { ott: 'netflix', membership: 'standard' },
      { ott: 'netflix', membership: 'premium' },
      { ott: 'watcha', membership: 'premium' },
      { ott: 'tving', membership: 'standard' },
      { ott: 'tving', membership: 'premium' },
      { ott: 'youtube', membership: 'premium' },
      { ott: 'disney', membership: 'basic' },
      { ott: 'coupangPlay', membership: 'basic' },
      { ott: 'wavve', membership: 'standard' },
      { ott: 'wavve', membership: 'premium' },
    ];

    for (let i = 0; i < wrapper.length; i += 1) {
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

  it('should render new groups when page button clicks', () => {
    mockMainPage = (
      <Provider store={mockPaginationStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(mockMainPage);

    const wrapper = component.find('.main__group-list ul li a');

    wrapper.at(2).simulate('click');

    expect(component.find('.group-item').length).toBe(2);
  });

  it('should render previous/next content when press click button in recommendation', () => {
    mockMainPage = (
      <Provider store={mockPaginationStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    localStorage.setItem('mainTab', 'content');
    const component = mount(mockMainPage);

    const previousButtonWrapper = component.find(
      '.main__content-list__poster__previous',
    );
    const nextButtonWrapper = component.find(
      '.main__content-list__poster__next',
    );

    nextButtonWrapper.at(0).simulate('click');

    expect(component.find('.content-list-item').at(0).text()).toBe('4');

    previousButtonWrapper.at(0).simulate('click');

    expect(component.find('.content-list-item').at(0).text()).toBe('1');
  });

  it('should render previous/next content when press click button in trending', () => {
    mockMainPage = (
      <Provider store={mockPaginationStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    localStorage.setItem('mainTab', 'content');
    const component = mount(mockMainPage);

    const previousButtonWrapper = component.find(
      '.main__content-list__poster__previous',
    );
    const nextButtonWrapper = component.find(
      '.main__content-list__poster__next',
    );

    nextButtonWrapper.at(1).simulate('click');

    expect(
      component
        .find('.main__content-list')
        .at(1)
        .find('.content-list-item')
        .at(0)
        .text(),
    ).toBe('4');

    previousButtonWrapper.at(1).simulate('click');

    expect(
      component
        .find('.main__content-list')
        .at(1)
        .find('.content-list-item')
        .at(0)
        .text(),
    ).toBe('1');
  });

  it('should set content search input with user input', () => {
    mockMainPage = (
      <Provider store={mockPaginationStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    localStorage.setItem('mainTab', 'content');
    const component = mount(mockMainPage);

    component
      .find('#content-search-input')
      .simulate('change', { target: { value: 'mockInput' } });

    expect(component.find('#content-search-input').props().value).toBe(
      'mockInput',
    );
  });

  it('should render search Contents when click search Click button', () => {
    mockMainPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    localStorage.setItem('mainTab', 'content');
    ContentReducer.getSearchContents = jest.fn(() => () => {});
    const component = mount(mockMainPage);

    component
      .find('#content-search-input')
      .simulate('change', { target: { value: 'harry' } });

    component.find('#content-search-button').simulate('click');

    expect(ContentReducer.getSearchContents).toHaveBeenCalledTimes(1);
  });

  it('should render previous/next content when press click button in searched', () => {
    mockMainPage = (
      <Provider store={mockPaginationStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={MainPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    localStorage.setItem('mainTab', 'content');
    const component = mount(mockMainPage);

    const previousButtonWrapper = component.find(
      '.main__content-list__poster__previous',
    );
    const nextButtonWrapper = component.find(
      '.main__content-list__poster__next',
    );

    nextButtonWrapper.at(2).simulate('click');

    expect(
      component
        .find('.main__content-list')
        .at(2)
        .find('.content-list-item')
        .at(0)
        .text(),
    ).toBe('4');

    previousButtonWrapper.at(2).simulate('click');

    expect(
      component
        .find('.main__content-list')
        .at(2)
        .find('.content-list-item')
        .at(0)
        .text(),
    ).toBe('1');
  });
});
