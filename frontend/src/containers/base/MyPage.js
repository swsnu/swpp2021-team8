import React from 'react';
import GroupList from '../../components/group/GroupList';
import Calendar from '../../components/base/Calendar';
import ContentList from '../../components/content/ContentList';

const MyPage = () => {
  return (
    <>
      <GroupList />
      <Calendar />
      <ContentList />
    </>
  );
};

export default MyPage;
