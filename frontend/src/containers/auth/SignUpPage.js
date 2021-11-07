import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { signUp } from '../../store/AuthStore';

import './SignUpPage.scss';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [username, setUsername] = useState('');

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);

  const dispatch = useDispatch();
  const signUpError = useSelector((state) => state.auth.signUpError);

  const checkPasswordEqual = () => {
    if (password === passwordConfirm) {
      setIsPasswordEqual(true);
    } else {
      setIsPasswordEqual(false);
    }
  };

  const checkPasswordValid = () => {
    if (
      password.match(/[a-zA-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[a-zA-Z0-9]{8,12}/)
    ) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  useEffect(() => {
    checkPasswordValid();
    checkPasswordEqual();
  }, [password, passwordConfirm]);

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

  const onCreateAccountClick = () => {
    // TODO: Validation check
    if (isPasswordValid && isPasswordEqual) {
      dispatch(signUp({ email, password, username }));
    }
  };

  return (
    <>
      <form className="signup" id="signup-form">
        <div className="signup__header">Sign Up</div>
        <div className="signup__body">
          <label htmlFor="email">Email</label>
          <input
            className={signUpError === 'email' ? 'signup__error' : ''}
            type="text"
            name="email"
            id="email-input"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="signup__body">
          <label htmlFor="password">Password</label>
          <input
            className={signUpError === 'password' ? 'signup__error' : ''}
            type="password"
            name="password"
            id="password-input"
            value={password}
            onChange={onPasswordChange}
            placeholder="Enter your password"
          />
        </div>
        <div className="signup__body signup__confirm">
          <input
            className={signUpError === 'password' ? 'signup__error' : ''}
            type="password"
            name="password-confirm"
            id="password-confirm-input"
            value={passwordConfirm}
            onChange={onPasswordConfirmChange}
            placeholder="Enter your password again"
          />
        </div>
        <div className="signup__body">
          <div className="signup__body--password">
            <span>
              {isPasswordValid ? (
                <FaCheckCircle style={{ color: 'green' }} />
              ) : (
                <FaTimesCircle style={{ color: 'red' }} />
              )}
            </span>
            8-12 digits, alphabet
          </div>
        </div>
        <div className="signup__body" style={{ marginTop: '10px' }}>
          <div className="signup__body--password">
            <span>
              {isPasswordEqual ? (
                <FaCheckCircle style={{ color: 'green' }} />
              ) : (
                <FaTimesCircle style={{ color: 'red' }} />
              )}
            </span>
            password match
          </div>
        </div>
        <div className="signup__body">
          <label htmlFor="username">username</label>
          <input
            className={signUpError === 'username' ? 'signup__error' : ''}
            type="text"
            name="username"
            value={username}
            id="username-input"
            onChange={onUsernameChange}
            placeholder="Enter your username"
          />
        </div>
        <div className="signup__body">
          <button
            id="create-account-button"
            onClick={onCreateAccountClick}
            type="button"
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUpPage;
