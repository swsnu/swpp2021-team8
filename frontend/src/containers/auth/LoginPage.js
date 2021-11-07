import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logIn } from '../../store/AuthStore';
import './LoginPage.scss';

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.loginError);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLoginClick = () => {
    dispatch(logIn({ email, password }));
  };

  const onSignUpClick = () => {
    history.push('/signup');
  };

  return (
    <>
      <form className="login" id="signup-form">
        <div className="login__header">Login</div>
        <div className="login__body">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className={loginError === 'email' ? 'login__error' : ''}
            name="email"
            id="email-input"
            value={email}
            placeholder="Enter your email"
            onChange={onEmailChange}
          />
        </div>
        <div className="login__body">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className={
              loginError === 'password' || loginError === 'email'
                ? 'login__error'
                : ''
            }
            name="password"
            id="password-input"
            value={password}
            placeholder="Enter your password"
            onChange={onPasswordChange}
          />
        </div>
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
