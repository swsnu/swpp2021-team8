import React, { useState } from 'react';
import GroupSearch from '../../components/group/GroupSearch';
import GroupList from '../../components/group/GroupList';
import ContentSearch from '../../components/content/ContentSearch';
import ContentList from '../../components/content/ContentList';

const MainPage = ({ history }) => {
  const [tab, setTab] = useState('group');

  const onGroupTabClick = () => {
    setTab('group');
  };

  const onContentTabClick = () => {
    setTab('content');
  };

  const onCreateGroupClick = () => {
    history.push('/group/create');
  };
  return (
    <>
      <button id="group-tab" onClick={onGroupTabClick} type="button">
        Group Tab
      </button>
      <button id="content-tab" onClick={onContentTabClick} type="button">
        Content Tab
      </button>
      {tab === 'group' ? (
        <>
          <button
            id="create-group-button"
            onClick={onCreateGroupClick}
            type="button"
          >
            Create Group
          </button>
          <GroupSearch />
          <GroupList />
        </>
      ) : (
        <>
          <ContentSearch />
          <ContentList />
          <ContentList />
        </>
      )}
    </>
  );
};

export default MainPage;
