import React from 'react';
import { withRouter } from 'react-router-dom';
import { Img } from 'react-image';
import './ContentListItem.scss';

const ContentListItem = ({ content, history }) => {
  const onImageClick = () => {
    if (content.id !== 0) {
      history.push(`/content/${content.id}`);
    }
  };
  return (
    <>
      <div
        onClick={onImageClick}
        role="button"
        tabIndex={0}
        className={`content-list ${content.id === 0 ? 'noClick' : ''}`}
      >
        <Img src={[content.poster]} />
      </div>
    </>
  );
};

export default withRouter(ContentListItem);
