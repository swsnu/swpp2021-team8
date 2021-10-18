import React, { useState } from 'react';
import GroupList from '../../components/group/GroupList';
import Calendar from '../../components/base/Calendar';
import ContentSearch from '../../components/content/ContentSearch';
import ContentList from '../../components/content/ContentList';

const MyPage = () => {
  const [tab, setTab] = useState('group');
  const onContentTabClick = (e) => {
    setTab('content');
  };

  const onGroupTabClick = (e) => {
    setTab('group');
  };
  return (
    <>
      <button id="group-tab-button" onClick={onContentTabClick}>
        Group
      </button>
      <button id="content-tab-button" onClick={onGroupTabClick}>
        Content
      </button>
      {tab === 'group' ? (
        <>
          <GroupList />
          <Calendar />
        </>
      ) : (
        <>
          <ContentSearch />
          <ContentList />
        </>
      )}
    </>
  );
};

export default MyPage;
