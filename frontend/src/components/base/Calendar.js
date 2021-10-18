import React from 'react';

const Calendar = () => {
  const onPreviousClick = (e) => {
    //TODO
  };

  const onNextClick = (e) => {
    //TODO
  };
  return (
    <>
      <button id="previous-button" onClick={onPreviousClick}>
        Previous
      </button>
      <button id="next-button" onClick={onNextClick}>
        Previous
      </button>
    </>
  );
};

export default Calendar;
