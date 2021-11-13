import axios from 'axios';

const initialState = {
  groups: [],
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
    const res = await axios.get(`/api/group/?${query ?? ''}`);
    dispatch(_getGroups(res.data));
  } catch (e) {
    // TODO
  }
};

export const getGroupDetail = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/group/${id}`);
    dispatch(_getGroupDetail(res.data));
  } catch (e) {}
};

export const createGroup = (groupInfo) => async (dispatch) => {
  try {
    const res = await axios.post('/api/group', groupInfo);
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
    await axios.post(`/api/group/${groupId}/user/${userId}`);
    dispatch(_addUserToGroup(groupId, userId));
  } catch (e) {}
};

export const deleteUserFromGroup = (groupId, userId) => async (dispatch) => {
  try {
    await axios.delete(`/api/group/${groupId}/user/${userId}`);
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
