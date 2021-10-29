import React, { useState } from 'react';
import ContentList from './ContentList';

const ContentSearch = () => {
  const [title, setTitle] = useState('');
  const onTitleChange = (e) => {
    setTitle(e.target.value);
    // TODO
  };

  return (
    <>
      <input
        type="text"
        id="title-input"
        name="title"
        value={title}
        onChange={onTitleChange}
      />
      <ContentList />
    </>
  );
};

export default ContentSearch;
