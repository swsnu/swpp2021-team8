import React, { useState } from 'react';
import Calendar from '../../components/base/Calendar';
import GroupListItem from '../../components/group/GroupListItem';
import './MyPage.scss';

const MyPage = () => {
  const [groups] = useState(
    [
      {
        id: 1,
        platform: 'netflix',
        title: 'Netflix Chillers',
        leader: 'Netlover',
        membership: 'Premium',
        price: 5400,
        curMember: 3,
        maxMember: 4,
        duration: 2,
      },
      {
        id: 2,
        platform: 'watcha',
        title: 'Watcha Thriller Pot',
        leader: 'swpp',
        membership: 'Basic',
        price: 1800,
        curMember: 3,
        maxMember: 4,
        duration: 1,
      },
      {
        id: 3,
        platform: 'tving',
        title: 'Tvinging',
        leader: 'lion',
        membership: 'Premium',
        price: 4200,
        curMember: 2,
        maxMember: 4,
        duration: 5,
      },
    ],
  );
  return (
    <div className="mypage">
      <div className="mypage__info">
        <h1> My Page </h1>
        <div className="mypage__info__email">
          <h2 className="category">email</h2>
          <h2 className="content">swpp@snu.ac.kr</h2>
        </div>
        <div className="mypage__info__username">
          <h2 className="category">user name</h2>
          <h2 className="content">iluvswpp</h2>
        </div>
      </div>
      <div className="mypage__content">
        <div className="mypage__grouplist">
          <h2>My Group</h2>
          {groups.map((group) => {
            return <GroupListItem group={group} key={group.id} />;
          })}
        </div>
        <hr />
        <div className="mypage__calendar">
          <h2>Calendar</h2>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
