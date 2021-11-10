import React from 'react';
import { withRouter } from 'react-router-dom';
import './GroupListItem.scss';

const GroupListItem = ({ group, history }) => {
  let vacantPercent =
    ((group.maxMember - group.curMember) * 100) / group.maxMember;

  let takenPercent = 0;
  switch (vacantPercent) {
    case 0:
      takenPercent = 0;
      break;
    case 100:
      break;
    default:
      vacantPercent -= 10;
      takenPercent = vacantPercent + 10;
  }

  const gradientStyle = {
    background: `linear-gradient(to right, #C99208 ${vacantPercent}%, #CD3131 ${takenPercent}%)`,
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
            src={`/images/${group.platform}.png`}
            alt={group.platform}
            width="55"
            height="70"
          />
        </div>
        <div className="group-item__title">
          <span className="group-item__title--title">{group.title}</span>
          <span className="group-item__title--creator">{group.leader}</span>
        </div>
        <div className="group-item__membership">
          <span className="group-item__membership--membership">
            {group.membership}
          </span>
          <span className="group-item__membership--price">
            {`₩${group.price}`}
          </span>
        </div>
        <div className="group-item__member">{`${group.curMember}/${group.maxMember}`}</div>
        <div className="group-item__duration">
          {group.duration > 12 ? '1 yr ~' : `${group.duration} mon.`}
        </div>
      </div>
    </>
  );
};

export default withRouter(GroupListItem);
