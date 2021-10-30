import React from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import MainPage from './containers/base/MainPage';
import MyPage from './containers/base/MyPage';
import LoginPage from './containers/auth/LoginPage';
import SignUpPage from './containers/auth/SignUpPage';
import GroupCreatePage from './containers/group/GroupCreatePage';
import GroupDetailPage from './containers/group/GroupDetailPage';
import GroupEditPage from './containers/group/GroupEditPage';
import ContentDetailPage from './containers/content/ContentDetailPage';
import NavBar from './components/base/NavBar';

function App({ history }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <ConnectedRouter history={history}>
      <NavBar isLoggedIn={isLoggedIn} />
      {isLoggedIn ? (
        <Switch>
          <Route path="/main" component={MainPage} exact />
          <Route path="/mypage" component={MyPage} exact />
          <Route path="/group/create" component={GroupCreatePage} exact />
          <Route path="/group/:id" component={GroupDetailPage} exact />
          <Route path="/group/:id/edit" component={GroupEditPage} exact />
          <Route path="/content/:id/" component={ContentDetailPage} exact />
          <Redirect to="/main" exact />
        </Switch>
      ) : (
        <Switch>
          <Route path="/login" component={LoginPage} exact />
          <Route path="/signup" component={SignUpPage} exact />
          <Redirect to="/login" exact />
        </Switch>
      )}
    </ConnectedRouter>
  );
}

export default App;
