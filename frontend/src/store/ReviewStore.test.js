import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import review, {
  createReview,
  deleteReview,
  editReview,
  getReviews,
} from './ReviewStore';

const store = createStore(review, applyMiddleware(thunk));

describe('ReviewStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should get review for the contents', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, content: 'mockReview' }] };
    });

    await store.dispatch(getReviews());
    const state = store.getState();

    expect(state.reviews).toEqual([{ id: 1, content: 'mockReview' }]);
  });

  it('should create a new review properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, content: 'mockReview' }] };
    });

    axios.post = jest.fn(async () => {
      return { data: { id: 2, content: 'mockReview2' } };
    });

    await store.dispatch(getReviews());
    await store.dispatch(createReview());
    const state = store.getState();

    expect(state.reviews).toEqual([
      { id: 1, content: 'mockReview' },
      { id: 2, content: 'mockReview2' },
    ]);
  });

  it('should edit review detail properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, content: 'mockReview' },
          { id: 2, content: 'mockReview2' },
        ],
      };
    });

    axios.put = jest.fn(async () => {
      return { data: { id: 2, content: 'mockReview2_edited' } };
    });

    await store.dispatch(getReviews());
    await store.dispatch(editReview());
    const state = store.getState();

    expect(state.reviews).toEqual([
      { id: 1, content: 'mockReview' },
      { id: 2, content: 'mockReview2_edited' },
    ]);
  });

  it('should delete review properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, content: 'mockReview' },
          { id: 2, content: 'mockReview2' },
        ],
      };
    });

    axios.delete = jest.fn(async () => {});

    await store.dispatch(getReviews());
    await store.dispatch(deleteReview(2));
    const state = store.getState();

    expect(state.reviews).toEqual([{ id: 1, content: 'mockReview' }]);
  });
});
