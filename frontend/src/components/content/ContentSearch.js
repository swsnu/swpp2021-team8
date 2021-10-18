import React from 'react';
import ContentList from './ContentList';

const ContentSearch = () => {
  const onSearchClick = (e) => {
    //TODO
  };
  return (
    <>
      <input type="text" id="title-input" name="title" />
      <button id="search-button" onClick={onSearchClick}>
        Search
      </button>
      <ContentList />
    </>
  );
};

export default ContentSearch;
