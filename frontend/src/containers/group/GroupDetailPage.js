import React from 'react';

const GroupDetailPage = ({ history }) => {
  const onBackClick = () => {
    history.goBack();
  };

  const onJoinClick = () => {
    // TODO
  };

  const onQuitClick = () => {
    // TODO
  };

  const onEditClick = () => {
    // TODO
  };

  const onDeleteClick = () => {
    // TODO
  };

  return (
    <>
      <button id="back-button" onClick={onBackClick} type="button">
        Back
      </button>
      <button id="join-button" onClick={onJoinClick} type="button">
        Join
      </button>
      <button id="quit-button" onClick={onQuitClick} type="button">
        Quit
      </button>
      <button id="edit-button" onClick={onEditClick} type="button">
        Edit
      </button>
      <button id="delete-button" onClick={onDeleteClick} type="button">
        Delete
      </button>
    </>
  );
};

export default GroupDetailPage;
