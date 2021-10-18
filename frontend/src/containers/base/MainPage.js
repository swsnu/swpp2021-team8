import React from 'react';
import GroupSearch from '../../components/group/GroupSearch';
import GroupList from '../../components/group/GroupList';
import ContentList from '../../components/content/ContentList';

const MainPage = ({ history }) => {
  const onCreateGroupClick = (e) => {
    history.push('/group/create');
  };
  return (
    <>
      <button id="create-group-button" onClick={onCreateGroupClick}>
        Create Group
      </button>
      <GroupSearch />
      <GroupList />
      <ContentList />
    </>
  );
};

export default MainPage;
