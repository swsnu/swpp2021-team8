import React from 'react';

const GroupCreatePage = ({ history }) => {
  const onBackClick = () => {
    history.goBack();
  };

  const onOTTClick = () => {
    // TODO
  };

  const onCancelClick = () => {
    // TODO
  };

  const onCreateGroupClick = () => {
    // TODO
  };

  return (
    <>
      <button id="back-button" onClick={onBackClick} type="button">
        Back
      </button>
      <button id="ott-button" onClick={onOTTClick} type="button">
        OTT button TODO
      </button>
      <select id="membership-select">membership TODO</select>
      <select id="people-select">people TODO</select>
      <input id="public-input" name="public" type="checkbox" />
      <input id="password-input" name="password" type="password" />
      <input
        id="password-confirm-input"
        name="password-confirm"
        type="password"
      />
      <input id="group-title-input" name="group-title" type="text" />
      <input id="description-input" name="description" type="text" />
      <select id="account-bank-select">account bank TODO</select>
      <input id="account-number-input" name="account-number" type="text" />
      <input id="account-name-input" name="account-name" type="text" />
      <button id="cancel-button" onClick={onCancelClick} type="button">
        Cancel
      </button>
      <button
        id="create-group-button"
        onClick={onCreateGroupClick}
        type="button"
      >
        Create Group
      </button>
    </>
  );
};

export default GroupCreatePage;
