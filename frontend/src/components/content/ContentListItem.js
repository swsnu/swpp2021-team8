import React from 'react';
import { withRouter } from 'react-router-dom';

const ContentListItem = ({ content, history }) => {
  const onImageClick = () => {
    history.push(`/content/${content.id}`);
  };
  return (
    <>
      <div onClick={onImageClick} role="button" tabIndex={0}>
        <img
          src={`/images/posters/${content.id}.png`}
          alt={`/images/posters/${content.id}.png`}
          width={210}
          height={280}
        />
      </div>
    </>
  );
};

export default withRouter(ContentListItem);
