import React from 'react';
import { withRouter } from 'react-router-dom';
import './GroupListItem.scss';

const GroupListItem = ({ group, history, onlyTitle = false }) => {
  let takenPercent = (group.currentPeople * 100) / group.maxPeople;

  let vacantPercent = 0;
  switch (takenPercent) {
    case 0:
      vacantPercent = 0;
      break;
    case 100:
      break;
    default:
      vacantPercent = takenPercent + 10;
      takenPercent -= 10;
  }

  const gradientStyle = {
    background: `linear-gradient(to right, #CD3131 ${takenPercent}%, #C99208 ${vacantPercent}%)`,
  };

  const onGroupItemClick = () => {
    history.push(`/group/${group.id}`);
  };

  return (
    <>
      <div
        className="group-item"
        style={gradientStyle}
        role="button"
        tabIndex={0}
        onClick={onGroupItemClick}
      >
        <div className="group-item__platform">
          <img
            src={`/images/${group.platform.toLowerCase()}.png`}
            alt={group.platform}
            width="50"
            height="50"
          />
        </div>
        <div className="group-item__title">
          <span className="group-item__title--title">{group.name}</span>
          <span className="group-item__title--leader">{group.leader}</span>
        </div>
        {!onlyTitle ? (
          <>
            <div className="group-item__membership">
              <span className="group-item__membership--membership">
                {group.membership}
              </span>
              <span className="group-item__membership--cost">
                {`₩${group.cost}`}
              </span>
            </div>
            <div className="group-item__member">{`${group.currentPeople}/${group.maxPeople}`}</div>
            <div className="group-item__payday">{group.payday}</div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default withRouter(GroupListItem);
