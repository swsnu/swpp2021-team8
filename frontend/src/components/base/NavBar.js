import React from 'react';
import { withRouter } from 'react-router-dom';

const NavBar = ({ history, isLoggedIn = false }) => {
  const onLogoClick = () => {
    history.push('/main');
  };

  const onMyPageClick = () => {
    history.push('/mypage');
  };

  // TODO: dispatch action
  const onLogOutClick = () => {};

  return (
    <>
      <button id="logo-button" onClick={onLogoClick} type="button">
        Subroker
      </button>
      {isLoggedIn && (
        <>
          <button id="my-page-button" onClick={onMyPageClick} type="button">
            My Page
          </button>
          <button id="logout-button" onClick={onLogOutClick} type="button">
            LogOut
          </button>
        </>
      )}
    </>
  );
};

export default withRouter(NavBar);
