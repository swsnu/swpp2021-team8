import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import content, {
  addFavoriteContent,
  deleteFavoriteContent,
  getContentDetail,
  getFavoriteContents,
  getRecommendationContents,
  getSearchContents,
  getTrendingContents,
} from './ContentStore';

const store = createStore(content, applyMiddleware(thunk));

describe('ContentStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return searched contents properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    await store.dispatch(getSearchContents());
    const state = store.getState();

    expect(state.searchContents).toEqual([{ id: 1, name: 'mockContent' }]);
  });

  it('should return content detail properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: { id: 1, name: 'mockContent' } };
    });

    await store.dispatch(getContentDetail(1));
    const state = store.getState();

    expect(state.selectedContent).toEqual({ id: 1, name: 'mockContent' });
  });

  it('should return recommended content properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    await store.dispatch(getRecommendationContents());
    const state = store.getState();

    expect(state.recommendationContents).toEqual([
      { id: 1, name: 'mockContent' },
    ]);
  });

  it('should return favorite content properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    await store.dispatch(getFavoriteContents());
    const state = store.getState();

    expect(state.favoriteContents).toEqual([{ id: 1, name: 'mockContent' }]);
  });

  it('should add favorite content properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    axios.post = jest.fn(async () => {
      return { data: { id: 2, name: 'mockContent2' } };
    });

    await store.dispatch(getFavoriteContents());
    await store.dispatch(addFavoriteContent(1, 2));
    const state = store.getState();

    expect(state.favoriteContents).toEqual([
      { id: 1, name: 'mockContent' },
      { id: 2, name: 'mockContent2' },
    ]);
  });

  it('should delete favorite content properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    axios.post = jest.fn(async () => {
      return { data: { id: 2, name: 'mockContent2' } };
    });

    axios.delete = jest.fn(async () => {});

    await store.dispatch(getFavoriteContents());
    await store.dispatch(addFavoriteContent(1, 1));
    const state = store.getState();

    expect(state.favoriteContents).toEqual([
      { id: 1, name: 'mockContent' },
      { id: 2, name: 'mockContent2' },
    ]);

    await store.dispatch(deleteFavoriteContent(1, 2));

    expect(store.getState().favoriteContents).toEqual([
      { id: 1, name: 'mockContent' },
    ]);
  });

  it('should return trending content properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, name: 'mockContent' }] };
    });

    await store.dispatch(getTrendingContents());
    const state = store.getState();

    expect(state.trendingContents).toEqual([{ id: 1, name: 'mockContent' }]);
  });
});
