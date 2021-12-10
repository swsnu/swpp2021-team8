import React from 'react';

const FilterButton = ({ ott, memberships, onClick }) => {
  return (
    <div className="main__group-filter__ott__option">
      <img
        src={`/images/${ott.toLowerCase()}.png`}
        alt={ott}
        height="40"
        width="40"
      />
      {Object.entries(memberships).map(([membership, isChecked]) => {
        return (
          <div
            className={`main__group-filter__ott__option__button ${
              isChecked ? 'main__group-filter__ott__option__button--active' : ''
            }`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            data-ott={ott}
            data-membership={membership}
            key={`${ott}-${membership}`}
          >
            {membership}
          </div>
        );
      })}
    </div>
  );
};
export default FilterButton;
