import React from 'react';
import GroupList from '../../components/group/GroupList';
import Calendar from '../../components/base/Calendar';
import ContentList from '../../components/content/ContentList';

import './MyPage.scss';

const MyPage = () => {
  return (
    <>
      <div className="mypage__info">
        <h1> My Page </h1>
        <div className="mypage__info__email">email</div>
        <div className="mypage__info__username">username</div>
      </div>
      <GroupList />
      <Calendar />
      <ContentList />
    </>
  );
};

export default MyPage;
