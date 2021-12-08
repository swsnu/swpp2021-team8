import React from 'react';
import './Loading.scss';

const Loading = () => {
  return (
    <div className="loader">
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
};

export default Loading;
