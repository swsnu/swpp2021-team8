import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ContentDetailPage from './ContentDetailPage';
import { getMockStore, history } from '../../test-utils/mock';
import * as ContentReducer from '../../store/ContentStore';
import * as ReviewReducer from '../../store/ReviewStore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: jest.fn(() => {
    return { id: 1 };
  }),
}));

jest.mock('sweetalert2-react-content', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(() => {
    return {
      fire: jest.fn(async () => {
        return { isConfirmed: true };
      }),
    };
  }),
}));

const mockStore = getMockStore(
  {
    user: {
      id: 1,
      username: 'user1',
    },
  },
  {
    selectedContent: { id: 1 },
    isFavorite: false,
  },
  {},
  {},
  { reviews: [{ user_id: 1 }] },
);

const mockStoreFavorite = getMockStore(
  {
    user: {
      id: 1,
      username: 'user1',
    },
  },
  {
    selectedContent: { id: 1 },
    isFavorite: true,
  },
  {},
  {},
  { reviews: [{ user_id: 1 }] },
);

describe('<ContentDetailPage />', () => {
  let mockContentDetailPage;

  beforeEach(() => {
    mockContentDetailPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Route path="/" component={ContentDetailPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    redux.useDispatch = jest.fn(() => () => {});
    ContentReducer.addFavoriteContent = jest.fn(() => () => {});
    ContentReducer.deleteFavoriteContent = jest.fn(() => () => {});
    ContentReducer.getContentDetail = jest.fn(() => () => {});
    ReviewReducer.createReview = jest.fn(() => () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Content detail page well', () => {
    const component = mount(mockContentDetailPage);

    expect(component.find(ContentDetailPage).length).toBe(1);
  });

  it('should change review', () => {
    const component = mount(mockContentDetailPage);

    component
      .find('#new-review-content-input')
      .simulate('change', { target: { value: 'mockInput' } });

    expect(component.find('#new-review-content-input').props().value).toBe(
      'mockInput',
    );
  });

  it('should move to back when clicking back button', () => {
    const component = mount(mockContentDetailPage);

    component.find('#back-button').simulate('click');

    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should add favorite content when isFavorite is false', () => {
    const component = mount(mockContentDetailPage);

    component.find('#heart_false').simulate('click');

    expect(ContentReducer.addFavoriteContent).toHaveBeenCalledTimes(1);
  });

  it('should delete favorite content when isFavorite is true', () => {
    mockContentDetailPage = (
      <Provider store={mockStoreFavorite}>
        <ConnectedRouter history={history}>
          <Route path="/" component={ContentDetailPage} exact />
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(mockContentDetailPage);

    component.find('#heart_true').simulate('click');

    expect(ContentReducer.deleteFavoriteContent).toHaveBeenCalledTimes(1);
  });

  it('should edit review edit review button clicked', () => {
    const component = mount(mockContentDetailPage);

    component.find('#edit-button').simulate('click');
  });

  it('should delete review delete review button clicked', () => {
    const component = mount(mockContentDetailPage);

    component.find('#delete-button').simulate('click');
  });

  it('should create a new review when create a review clicked', () => {
    const component = mount(mockContentDetailPage);

    component
      .find('#new-review-content-input')
      .simulate('change', { target: { value: 'mockInput' } });
    component.find('#create-review-button').simulate('click');

    expect(ReviewReducer.createReview).toHaveBeenCalledTimes(1);
  });
});
