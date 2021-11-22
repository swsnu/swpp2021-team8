import React from 'react';
import { withRouter } from 'react-router-dom';

const ContentListItem = ({ content, history }) => {
  const onImageClick = () => {
    history.push(`/content/${content.id}`);
  };
  return (
    <>
      <div
        onClick={onImageClick}
        role="button"
        tabIndex={0}
        style={{ margin: '0px 10px' }}
      >
        <img
          src={`/images/posters/${content.id}.png`}
          alt={`/images/posters/${content.id}.png`}
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
};

export default withRouter(ContentListItem);
