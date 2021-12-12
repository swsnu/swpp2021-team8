/* eslint object-curly-newline: ["off"] */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
/* eslint-disable-next-line  */
import { createBrowserHistory } from 'history';

import thunk from 'redux-thunk';
import auth from './AuthStore';
import content from './ContentStore';
import group from './GroupStore';
import ott from './OttStore';
import review from './ReviewStore';
import notification from './NotificationStore';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
  auth,
  content,
  group,
  ott,
  review,
  notification,
  router: connectRouter(history),
});
export const middlewares = [thunk, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export default store;
