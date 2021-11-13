import axios from 'axios';
import group, {
  addUserToGroup,
  createGroup,
  deleteGroup,
  deleteUserFromGroup,
  editGroup,
  getGroupDetail,
  getGroups,
} from './GroupStore';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(group, applyMiddleware(thunk));

describe('GroupStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return proper groups', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, title: 'mockGroup' }] };
    });

    await store.dispatch(getGroups());
    const state = store.getState();

    expect(state.groups).toEqual([{ id: 1, title: 'mockGroup' }]);
  });

  it('should return proper group detail', async () => {
    axios.get = jest.fn(async () => {
      return { data: { id: 1, title: 'mockGroup' } };
    });

    await store.dispatch(getGroupDetail());
    const state = store.getState();

    expect(state.selectedGroup).toEqual({ id: 1, title: 'mockGroup' });
  });

  it('should create a new group properly', async () => {
    axios.get = jest.fn(async () => {
      return { data: [{ id: 1, title: 'mockGroup' }] };
    });

    axios.post = jest.fn(async () => {
      return { data: { id: 2, title: 'mockGroup2' } };
    });

    await store.dispatch(getGroups());
    await store.dispatch(createGroup());
    const state = store.getState();

    expect(state.groups).toEqual([
      { id: 1, title: 'mockGroup' },
      { id: 2, title: 'mockGroup2' },
    ]);
  });

  it('should edit group detail properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, title: 'mockGroup' },
          { id: 2, title: 'mockGroup2' },
        ],
      };
    });

    axios.put = jest.fn(async () => {
      return { data: { id: 2, title: 'mockGroup2_edited' } };
    });

    await store.dispatch(getGroups());
    await store.dispatch(editGroup());
    const state = store.getState();

    expect(state.groups).toEqual([
      { id: 1, title: 'mockGroup' },
      { id: 2, title: 'mockGroup2_edited' },
    ]);
  });

  it('should delete group properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, title: 'mockGroup' },
          { id: 2, title: 'mockGroup2' },
        ],
      };
    });

    axios.delete = jest.fn(async () => {});

    await store.dispatch(getGroups());
    await store.dispatch(deleteGroup(2));
    const state = store.getState();

    expect(state.groups).toEqual([{ id: 1, title: 'mockGroup' }]);
  });

  // TODO ADD User
  it('should add user to group properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, title: 'mockGroup' },
          { id: 2, title: 'mockGroup2' },
        ],
      };
    });

    axios.post = jest.fn(async () => {});

    await store.dispatch(getGroups());
    await store.dispatch(addUserToGroup(1, 2));
    const state = store.getState();

    expect(state.groups).toEqual([
      { id: 1, title: 'mockGroup' },
      { id: 2, title: 'mockGroup2' },
    ]);
  });

  // TODO DELETE User
  it('should delete user to group properly', async () => {
    axios.get = jest.fn(async () => {
      return {
        data: [
          { id: 1, title: 'mockGroup' },
          { id: 2, title: 'mockGroup2' },
        ],
      };
    });

    axios.post = jest.fn(async () => {});

    await store.dispatch(getGroups());
    await store.dispatch(deleteUserFromGroup(1, 2));
    const state = store.getState();

    expect(state.groups).toEqual([
      { id: 1, title: 'mockGroup' },
      { id: 2, title: 'mockGroup2' },
    ]);
  });
});
