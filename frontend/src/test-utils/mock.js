/* eslint object-curly-newline: ["off"] */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
/* eslint-disable-next-line  */
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

const getMockReducer = jest.fn(
  /* eslint no-unused-vars: ["off"]  */
  (initialState) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (state = initialState, action) => {
      return state;
    },
);

export const history = createBrowserHistory();
export const middlewares = [thunk, routerMiddleware(history)];

export const getMockStore = (
  authState,
  contentState,
  groupState,
  ottState,
  reviewState,
  notificationState = { notifications: [] },
) => {
  const authReducer = getMockReducer(authState);
  const contentReducer = getMockReducer(contentState);
  const groupReducer = getMockReducer(groupState);
  const ottReducer = getMockReducer(ottState);
  const reviewReducer = getMockReducer(reviewState);
  const notificationReducer = getMockReducer(notificationState);

  const rootReducer = combineReducers({
    auth: authReducer,
    content: contentReducer,
    group: groupReducer,
    ott: ottReducer,
    review: reviewReducer,
    notification: notificationReducer,
    router: connectRouter(history),
  });

  return createStore(rootReducer, applyMiddleware(...middlewares));
};
