import React, { useState } from 'react';

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLoginClick = (e) => {
    //TODO
  };

  const onSignUpClick = (e) => {
    history.push('/signup');
  };

  return (
    <>
      <form id="signup-form">
        <label htmlFor="email">email</label>
        <input
          type="text"
          name="email"
          id="email-input"
          value={email}
          onChange={onEmailChange}
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          id="password-input"
          value={password}
          onChange={onPasswordChange}
        />
        <button id="login-button" onClick={onLoginClick}>
          LogIn
        </button>
        <button id="signup-button" onClick={onSignUpClick}>
          SignUp
        </button>
      </form>
    </>
  );
};

export default LoginPage;
