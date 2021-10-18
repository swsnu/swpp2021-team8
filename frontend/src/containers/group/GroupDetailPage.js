import React from 'react';

const GroupDetailPage = ({ history }) => {
  const onBackClick = (e) => {
    history.goBack();
  };

  const onJoinClick = (e) => {
    //TODO
  };

  const onEditClick = (e) => {
    //TODO
  };

  const onDeleteClick = (e) => {
    //TODO
  };

  return (
    <>
      <button id="back-button" onClick={onBackClick}>
        Back
      </button>
      <button id="join-button" onClick={onJoinClick}>
        Join
      </button>
      <button id="edit-button" onClick={onEditClick}>
        Edit
      </button>
      <button id="delete-button" onClick={onDeleteClick}>
        Delete
      </button>
    </>
  );
};

export default GroupDetailPage;
