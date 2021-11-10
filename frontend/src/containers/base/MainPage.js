import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import GroupListItem from '../../components/group/GroupListItem';
import ContentList from '../../components/content/ContentList';
import './MainPage.scss';

const MainPage = ({ history }) => {
  const [tab, setTab] = useState('group');

  const groups = useSelector((state) => state.group.groups);

  const onGroupTabClick = () => {
    setTab('group');
  };

  const onContentTabClick = () => {
    setTab('content');
  };

  const onCreateGroupClick = () => {
    history.push('/group/create');
  };

  const onGroupSearchClick = () => {};
  const onContentSearchClick = () => {};

  return (
    <>
      <div className="main">
        <div className="main__header">
          <div
            className={`main__header--tab ${tab === 'group' ? 'active' : ''}`}
            onClick={onGroupTabClick}
            role="button"
            tabIndex={0}
          >
            Group
          </div>
          <div
            className={`main__header--tab ${tab === 'content' ? 'active' : ''}`}
            onClick={onContentTabClick}
            role="button"
            tabIndex={0}
          >
            Content
          </div>
          <div className="main__header--placeholder" />
        </div>
        {tab === 'group' ? (
          <>
            <div className="main__group-header">
              <div className="main__search">
                <input
                  id="group-search-input"
                  name="title"
                  placeholder="Search group title / creator"
                />
                <button
                  id="group-filter-button"
                  type="button"
                  className="main__search--filter"
                >
                  <FaFilter />
                </button>
                <button
                  id="group-search-button"
                  className="main__search--search"
                  onClick={onGroupSearchClick}
                  type="button"
                >
                  Search
                </button>
              </div>
              <button
                id="create-group-button"
                onClick={onCreateGroupClick}
                type="button"
              >
                Create Group
              </button>
            </div>

            <div className="main__group-body">
              <div className="main__group-body--header">
                <div className="group-item__platform">Platform</div>
                <div className="group-item__title">Title / Creator</div>
                <div className="group-item__membership">Membership / Price</div>
                <div className="group-item__member">Members</div>
                <div className="group-item__duration">Duration</div>
              </div>
              {groups.map((group) => {
                return <GroupListItem group={group} key={group.title} />;
              })}
            </div>
          </>
        ) : (
          <>
            <div className="main__content-header">
              <div className="main__search">
                <input
                  id="content-search-input"
                  name="title"
                  placeholder="Search movie title"
                />
                <button
                  id="content-filter-button"
                  type="button"
                  className="main__search--filter"
                >
                  <FaFilter />
                </button>
                <button
                  id="content-search-button"
                  className="main__search--search"
                  onClick={onContentSearchClick}
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
            <ContentList />
            <ContentList />
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;
