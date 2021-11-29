import React from 'react';
import './NavBar.scss';
import { withRouter } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = ({
  history,
  isLoggedIn = false,
  onLogOutClick,
  notDeletedGroupCount,
  deletedGroupCount,
}) => {
  const onLogoClick = () => {
    history.push('/main');
  };

  const onMyPageClick = () => {
    history.push('/mypage');
  };

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
          <div className="navbar__auth__group">
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
