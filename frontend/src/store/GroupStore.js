import axios from 'axios';

const initialState = {
  groups: [
    {
      id: 1,
      platform: 'netflix',
      title: 'Netflix Chillers',
      leader: 'Netlover',
      membership: 'Premium',
      price: 5400,
      curMember: 3,
      maxMember: 4,
      duration: 2,
    },
    {
      id: 2,
      platform: 'watcha',
      title: 'Watcha Thriller Pot',
      leader: 'swpp',
      membership: 'Basic',
      price: 1800,
      curMember: 3,
      maxMember: 4,
      duration: 1,
    },
    {
      id: 3,
      platform: 'tving',
      title: 'Tvinging',
      leader: 'lion',
      membership: 'Premium',
      price: 4200,
      curMember: 2,
      maxMember: 4,
      duration: 5,
    },
    {
      id: 4,
      platform: 'netflix',
      title: 'Netflixers',
      leader: 'iluvswpp',
      membership: 'Premium',
      price: 5400,
      curMember: 2,
      maxMember: 4,
      duration: 2,
    },
    {
      id: 5,
      platform: 'tving',
      title: 'Tving Chillers',
      leader: 'nouser',
      membership: 'Premium',
      price: 5400,
      curMember: 3,
      maxMember: 4,
      duration: 12,
    },
    {
      id: 6,
      platform: 'watcha',
      title: 'Watcha Thriller',
      leader: 'jason',
      membership: 'Premium',
      price: 3400,
      curMember: 0,
      maxMember: 6,
      duration: 3,
    },
    {
      id: 7,
      platform: 'netflix',
      title: 'Netflix Lovers',
      leader: 'hamtori',
      membership: 'Premium',
      price: 5400,
      curMember: 1,
      maxMember: 4,
      duration: 13,
    },
    {
      id: 8,
      platform: 'watcha',
      title: 'Watchers',
      leader: 'react',
      membership: 'Premium',
      price: 5400,
      curMember: 3,
      maxMember: 4,
      duration: 14,
    },
    {
      id: 9,
      platform: 'watcha',
      title: 'No title',
      leader: 'api',
      membership: 'Basic',
      price: 1800,
      curMember: 1,
      maxMember: 6,
      duration: 4,
    },
  ],
  selectedGroup: {},
};

const _getGroups = (groups) => {
  return { type: 'group/GET_GROUPS', groups };
};

const _getGroupDetail = (group) => {
  return { type: 'group/GET_GROUP_DETAIL', group };
};

const _createGroup = (group) => {
  return { type: 'group/CREATE_GROUP', group };
};

const _editGroup = (group) => {
  return { type: 'group/EDIT_GROUP', group };
};

const _deleteGroup = (id) => {
  return { type: 'group/DELETE_GROUP', id };
};

const _addUserToGroup = (groupId, userId) => {
  return { type: 'group/ADD_USER_TO_GROUP', groupId, userId };
};

const _deleteUserFromGroup = (groupId, userId) => {
  return { type: 'group/DELETE_USER_FROM_GROUP', groupId, userId };
};

export const getGroups = (query) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/group/?${query}/`);
    dispatch(_getGroups(res.data));
  } catch (e) {
    // TODO
  }
};

export const getGroupDetail = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/group/${id}/`);
    dispatch(_getGroupDetail(res.data));
  } catch (e) {}
};

export const createGroup = (groupInfo) => async (dispatch) => {
  try {
    const res = await axios.post('/api/group/', groupInfo);
    dispatch(_createGroup(res.data));
  } catch (e) {}
};

export const editGroup = (id, groupInfo) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/group/${id}`, groupInfo);
    dispatch(_editGroup(res.data));
  } catch (e) {}
};

export const deleteGroup = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/group/${id}`);
    dispatch(_deleteGroup(id));
  } catch (e) {}
};

export const addUserToGroup = (groupId, userId) => async (dispatch) => {
  try {
    await axios.post(`/api/group/${groupId}/user/${userId}/`);
    dispatch(_addUserToGroup(groupId, userId));
  } catch (e) {}
};

export const deleteUserFromGroup = (groupId, userId) => async (dispatch) => {
  try {
    await axios.delete(`/api/group/${groupId}/user/${userId}/`);
    dispatch(_deleteUserFromGroup(groupId, userId));
  } catch (e) {}
};

export default function GroupReducer(state = initialState, action) {
  switch (action.type) {
    case 'group/GET_GROUPS':
      return { ...state, groups: action.groups };

    case 'group/GET_GROUP_DETAIL':
      return { ...state, selectedGroup: action.group };

    case 'group/CREATE_GROUP':
      return {
        ...state,
        selectedGroup: action.group,
        groups: state.groups.concat(action.group),
      };

    case 'group/EDIT_GROUP':
      return {
        ...state,
        selectedGroup: action.group,
        groups: state.groups.map((group) => {
          if (group.id === action.group.id) {
            return action.group;
          } else {
            return group;
          }
        }),
      };

    case 'group/DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter((group) => group.id !== action.id),
      };

    // TODO: add user to group
    case 'group/ADD_USER_TO_GROUP':
      return {
        ...state,
        groups: state.groups.map((group) => {
          return group;
        }),
      };

    // TODO: delete user from group
    case 'group/DELETE_USER_FROM_GROUP':
      return {
        ...state,
        groups: state.groups.map((group) => {
          return group;
        }),
      };

    default:
      break;
  }
  return state;
}
