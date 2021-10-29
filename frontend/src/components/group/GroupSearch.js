import React from 'react';

const GroupSearch = () => {
  const onSearchClick = () => {
    // TODO
  };

  const onFilterClick = () => {
    // TODO
  };
  return (
    <>
      <p>title</p>
      <button id="search-button" onClick={onSearchClick} type="button">
        Search
      </button>
      <button id="filter-button" onClick={onFilterClick} type="button">
        Filter
      </button>
      <input id="ott-input" name="ott" />
    </>
  );
};

export default GroupSearch;
