/* eslint object-curly-newline: ["off"] */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
/* eslint-disable-next-line  */
import { createBrowserHistory } from 'history';

import thunk from 'redux-thunk';
import auth from './AuthStore';
import content from './ContentStore';
import group from './GroupStore';
import review from './ReviewStore';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
  auth,
  content,
  group,
  review,
  router: connectRouter(history),
});
export const middlewares = [thunk, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export default store;
