import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { getLoginStatus, logOut } from './store/AuthStore';
import Loading from './components/base/Loading';
import {
  deleteNotification,
  getNotifications,
} from './store/NotificationStore';

function App({ history }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { id, notDeletedGroupCount, deletedGroupCount } = useSelector(
    (state) => state.auth.user,
  );
  const notifications = useSelector(
    (state) => state.notification.notifications,
  );
  const groups = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, []);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && id) {
      dispatch(getNotifications(id));
    }
  }, [id]);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && id) {
      dispatch(getNotifications(id));
    }
  }, [groups]);

  const onLogOutClick = () => {
    dispatch(logOut());
  };

  return (
    <ConnectedRouter history={history}>
      <NavBar
        isLoggedIn={isLoggedIn}
        notDeletedGroupCount={notDeletedGroupCount}
        deletedGroupCount={deletedGroupCount}
        onLogOutClick={onLogOutClick}
        notifications={notifications}
        onNotificationClick={(_id) => dispatch(deleteNotification(_id))}
      />
      {isLoggedIn ? (
        id ? (
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
          <Loading />
        )
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
