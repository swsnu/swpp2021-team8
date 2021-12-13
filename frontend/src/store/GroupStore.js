import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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

const _deleteGroup = (group) => {
  return {
    type: 'group/DELETE_GROUP',
    id: group.id,
    willBeDeleted: group.willBeDeleted,
  };
};

const _addUserToGroup = (group) => {
  return { type: 'group/ADD_USER_TO_GROUP', group };
};

const _deleteUserFromGroup = (group) => {
  return { type: 'group/DELETE_USER_FROM_GROUP', group };
};

export const getGroups = (query) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/group/?${query ?? ''}`);
    dispatch(_getGroups(res.data));
  } catch (e) {}
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
    const res = await axios.put(`/api/group/${id}/`, groupInfo);
    dispatch(_editGroup(res.data));
  } catch (e) {}
};

export const deleteGroup = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/group/${id}/`);
    dispatch(_deleteGroup(res.data));
  } catch (e) {}
};

export const addUserToGroup = (group) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/group/${group.id}/user/`, group);
    dispatch(_addUserToGroup(res.data));
  } catch (e) {}
};

export const deleteUserFromGroup = (group) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/group/${group.id}/user/`);
    dispatch(_deleteUserFromGroup(res.data));
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
        groups: [...state.groups, action.group],
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

    case 'group/ADD_USER_TO_GROUP':
      return {
        ...state,
        groups: state.groups.map((group) => {
          if (group.id === action.group.id) {
            return {
              ...group,
              members: action.group.members,
              currentPeople: action.group.currentPeople,
            };
          } else {
            return group;
          }
        }),
        selectedGroup: {
          ...state.selectedGroup,
          members: action.group.members,
          currentPeople: action.group.currentPeople,
        },
      };

    case 'group/DELETE_USER_FROM_GROUP':
      return {
        ...state,
        groups: state.groups.map((group) => {
          if (group.id === action.group.id) {
            return {
              ...group,
              members: action.group.members,
              currentPeople: action.group.currentPeople,
            };
          } else {
            return group;
          }
        }),
        selectedGroup: {
          ...state.selectedGroup,
          members: action.group.members,
          currentPeople: action.group.currentPeople,
        },
      };

    default:
      break;
  }
  return state;
}
