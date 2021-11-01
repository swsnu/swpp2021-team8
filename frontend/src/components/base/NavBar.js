import React from 'react';
import './NavBar.scss';
import { withRouter } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = ({ history, isLoggedIn = false, onLogOutClick }) => {
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
          <FaUserCircle
            className="navbar__auth--mypage"
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
