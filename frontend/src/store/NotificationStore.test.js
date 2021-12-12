import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import notification, {
  deleteNotification,
  getNotifications,
} from './NotificationStore';

const store = createStore(notification, applyMiddleware(thunk));

describe('NotificationStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return proper notifications', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, type: 'create', content: 'create content' },
          { id: 2, type: 'delete', content: 'delete content' },
        ],
      };
    });

    await store.dispatch(getNotifications());
    const state = store.getState();

    expect(state.notifications).toEqual([
      { id: 1, type: 'create', content: 'create content' },
      { id: 2, type: 'delete', content: 'delete content' },
    ]);
  });

  it('should delete proper notification', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, type: 'create', content: 'create content' },
          { id: 2, type: 'delete', content: 'delete content' },
        ],
      };
    });

    axios.delete = jest.fn(async () => {});

    await store.dispatch(deleteNotification(2));
    const state = store.getState();

    expect(state.notifications).toEqual([
      { id: 1, type: 'create', content: 'create content' },
    ]);
  });
});
