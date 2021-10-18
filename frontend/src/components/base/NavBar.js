import React from 'react';
import { withRouter } from 'react-router-dom';

const NavBar = ({ history, isLoggedIn = false }) => {
  const onLogoClick = (e) => {
    history.push('/main');
  };

  const onMyPageClick = (e) => {
    history.push('/mypage');
  };

  // TODO: dispatch action
  const onLogOutClick = (e) => {};

  return (
    <>
      <button id="logo-button" onClick={onLogoClick}>
        Subroker
      </button>
      {isLoggedIn && (
        <>
          <button id="my-page-button" onClick={onMyPageClick}>
            My Page
          </button>
          <button id="logout-button" onClick={onLogOutClick}>
            LogOut
          </button>
        </>
      )}
    </>
  );
};

export default withRouter(NavBar);
