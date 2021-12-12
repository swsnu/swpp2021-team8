import React, { useState } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import './NavBar.scss';
import { withRouter } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = ({
  history,
  isLoggedIn = false,
  onLogOutClick,
  notDeletedGroupCount,
  deletedGroupCount,
  notifications,
  onNotificationClick,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const onBadgeClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const onLogoClick = () => {
    history.push('/main');
  };

  const onMyPageClick = () => {
    history.push('/mypage');
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <div className="navbar">
      <div
        className="navbar__logo"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
      >
        Subroker
      </div>
      {isLoggedIn && (
        <div className="navbar__auth">
          <div
            onClick={onBadgeClick}
            role="button"
            tabIndex={0}
            className="navbar__auth__notification"
          >
            <Badge badgeContent={notifications.length} color="primary" showZero>
              <NotificationsIcon />
            </Badge>
          </div>
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            transition
          >
            {({ TransitionProps }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Fade {...TransitionProps} timeout={350}>
                <Paper elevation={3}>
                  <Stack sx={{ width: '100%' }} spacing={1}>
                    <>
                      {notifications.map((notification) => {
                        let alertType;

                        switch (notification.type) {
                          case 'create':
                            alertType = 'success';
                            break;
                          case 'delete':
                            alertType = 'error';
                            break;
                          default:
                            alertType = 'info';
                            break;
                        }

                        return (
                          <Alert
                            key={`notification_${notification.id}`}
                            severity={alertType}
                            onClose={() => onNotificationClick(notification.id)}
                            sx={{ width: '100%' }}
                          >
                            <AlertTitle>{notification.type}</AlertTitle>
                            {notification.content}
                            <span style={{ marginLeft: 40 }}>
                              {new Date(
                                notification.created_at,
                              ).toLocaleString()}
                            </span>
                          </Alert>
                        );
                      })}
                    </>
                  </Stack>
                </Paper>
              </Fade>
            )}
          </Popper>
          <div
            className="navbar__auth__group"
            role="button"
            tabIndex={0}
            onClick={onMyPageClick}
          >
            <div className="navbar__auth__group__title">My Groups</div>
            <div className="navbar__auth__group__count">
              <span className="navbar__auth__group__count--not-deleted">
                {notDeletedGroupCount}
              </span>
              <span className="navbar__auth__group__count--deleted">
                {deletedGroupCount}
              </span>
            </div>
          </div>
          <FaUserCircle
            className="navbar__auth__mypage"
            onClick={onMyPageClick}
          />
          <button
            className="button"
            id="logout-button"
            onClick={onLogOutClick}
            type="button"
          >
            LogOut
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(NavBar);
