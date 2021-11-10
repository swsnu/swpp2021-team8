/* eslint object-curly-newline: ["off"] */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
/* eslint-disable-next-line  */
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

const getMockReducer = jest.fn(
  (initialState) =>
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
  reviewState,
) => {
  const authReducer = getMockReducer(authState);
  const contentReducer = getMockReducer(contentState);
  const groupReducer = getMockReducer(groupState);
  const reviewReducer = getMockReducer(reviewState);

  const rootReducer = combineReducers({
    auth: authReducer,
    content: contentReducer,
    group: groupReducer,
    review: reviewReducer,
    router: connectRouter(history),
  });

  return createStore(rootReducer, applyMiddleware(...middlewares));
};
