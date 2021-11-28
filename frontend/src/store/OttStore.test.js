import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import ott, {
    getOtts,
    getOttPlan,
} from './OttStore';

const store = createStore(ott, applyMiddleware(thunk));

describe('OttStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return proper otts', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, ott: 'mockOtt' }] };
    });

    await store.dispatch(getOtts());
    const state = store.getState();

    expect(state.otts).toEqual([{ id: 1, ott: 'mockOtt' }]);
  });

  it('should return proper ott plan', async () => {
    axios.get = jest.fn(async () => {
      return { data: { id: 1, ott: 'mockOtt' } };
    });
    const platform = {
        id: 1,
        name: '',
    };
    const membership = '';
    await store.dispatch(getOttPlan(platform, membership));
    const state = store.getState();

    expect(state.selectedOttPlan).toEqual({ id: 1, ott: 'mockOtt' });
  });

  it('should return null ott plan', async () => {
    axios.get = jest.fn(async () => {
      return { data: { id: 1, ott: 'mockOtt' } };
    });
    await store.dispatch(getOttPlan());
    const state = store.getState();

    expect(state.selectedOttPlan).toEqual(null);
  });
});
