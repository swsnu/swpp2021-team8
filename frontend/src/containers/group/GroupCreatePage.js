import React from 'react';

const GroupCreatePage = ({ history }) => {
  const onBackClick = (e) => {
    history.goBack();
  };

  const onOTTClick = (e) => {
    //TODO
  };

  const onCancelClick = (e) => {
    //TODO
  };

  const onCreateGroupClick = (e) => {
    //TODO
  };

  return (
    <>
      <button id="back-button" onClick={onBackClick}>
        Back
      </button>
      <button id="ott-button" onClick={onOTTClick}>
        OTT button TODO
      </button>
      <select id="membership-select">membership TODO</select>
      <select id="people-select">people TODO</select>
      <select id="duration-select">duration TODO</select>
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
      <button id="cancel-button" onClick={onCancelClick}>
        Cancel
      </button>
      <button id="create-group-button" onClick={onCreateGroupClick}>
        Create Group
      </button>
    </>
  );
};

export default GroupCreatePage;
