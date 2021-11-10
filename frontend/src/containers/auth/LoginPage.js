import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimesCircle } from 'react-icons/fa';
import { logIn } from '../../store/AuthStore';
import './LoginPage.scss';

const LoginPage = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.loginError);

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLoginClick = () => {
    dispatch(logIn({ username, password }));
  };

  const onSignUpClick = () => {
    history.push('/signup');
  };

  return (
    <>
      <form className="login" id="signup-form">
        <div className="login__header">Login</div>
        <div className="login__body">
          <label htmlFor="username">ID</label>
          <input
            type="text"
            name="username"
            id="username-input"
            value={username}
            placeholder="Enter your ID"
            onChange={onUsernameChange}
          />
        </div>
        <div className="login__body">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password-input"
            value={password}
            placeholder="Enter your password"
            onChange={onPasswordChange}
          />
        </div>
        {loginError ? (
          <div className="login__body">
            <div className="login__body--icon">
              <span>
                <FaTimesCircle style={{ color: 'red' }} />
              </span>
              {loginError}
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="login__body">
          <button
            className="login__body--login"
            id="login-button"
            onClick={onLoginClick}
            type="button"
          >
            Log In
          </button>
        </div>
        <div className="login__body">
          <button id="signup-button" onClick={onSignUpClick} type="button">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
