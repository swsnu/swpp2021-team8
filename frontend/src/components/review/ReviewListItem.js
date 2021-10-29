import React from 'react';

const ReviewListItem = () => {
  const onEditClick = () => {
    // TODO
  };

  const onDeleteClick = () => {
    // TODO
  };
  return (
    <>
      <p>user</p>
      <p>rate</p>
      <p>content</p>
      <button id="edit-button" onClick={onEditClick} type="button">
        Edit
      </button>
      <button id="delete-button" onClick={onDeleteClick} type="button">
        Delete
      </button>
    </>
  );
};

export default ReviewListItem;
