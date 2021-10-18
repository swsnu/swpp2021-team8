import React, { useState } from 'react';

const SignUpPage = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [username, setUsername] = useState('');

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onPasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  //TODO: create account
  const onCreateAccountClick = (e) => {};

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
        <label htmlFor="password-confirm">password confirm</label>
        <input
          type="password"
          name="password-confirm"
          id="password-confirm-input"
          value={passwordConfirm}
          onChange={onPasswordConfirmChange}
        />
        <label htmlFor="username">username</label>
        <input
          type="text"
          name="username"
          value={username}
          id="username-input"
          onChange={onUsernameChange}
        />
        <button id="create-account-button" onClick={onCreateAccountClick}>
          Create Account
        </button>
      </form>
    </>
  );
};

export default SignUpPage;
