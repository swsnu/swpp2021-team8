import React from 'react';

const GroupSearch = () => {
  const onSearchClick = (e) => {
    //TODO
  };

  const onFilterClick = (e) => {
    //TODO
  };
  return (
    <>
      <p>title</p>
      <button id="search-button" onClick={onSearchClick}>
        Search
      </button>
      <button id="filter-button" onClick={onFilterClick}>
        Filter
      </button>
      <input id="ott-input" name="ott" />
      <select id="duration-select"></select>
      <select id="people-left-select"></select>
      <select id="people-total-select"></select>
    </>
  );
};

export default GroupSearch;
