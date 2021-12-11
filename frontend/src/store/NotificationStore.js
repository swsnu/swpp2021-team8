import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  notifications: [],
};

const _getNotifications = (notifications) => {
  return {
    type: 'notification/GET_NOTIFICATIONS',
    notifications,
  };
};

const _deleteNotification = (id) => {
  return { type: 'notification/DELETE_NOTIFICATION', id };
};

export const getNotifications = (user) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/notification/?user=${user}`);
    dispatch(_getNotifications(res.data));
  } catch (e) {}
};

export const deleteNotification = (id) => async (dispatch) => {
  try {
    await axios.delete('/api/notification/', { data: { receiver: id } });
    dispatch(_deleteNotification(id));
  } catch (e) {}
};

export default function NotificationReducer(state = initialState, action) {
  switch (action.type) {
    case 'notification/GET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.notifications,
      };

    case 'notification/DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.id,
        ),
      };

    default:
      break;
  }
  return state;
}
