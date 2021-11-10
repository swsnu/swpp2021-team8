import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import GroupListItem from '../../components/group/GroupListItem';
import ContentListItem from '../../components/content/ContentListItem';
import './MainPage.scss';

const MainPage = ({ history }) => {
  const [tab, setTab] = useState(
    localStorage.getItem('mainTab') ? localStorage.getItem('mainTab') : 'group',
  );
  const [visibility, setVisibility] = useState(false);

  const groups = useSelector((state) => state.group.groups);
  const recommendationContents = useSelector(
    (state) => state.content.recommendationContents,
  );

  const trendingContents = useSelector(
    (state) => state.content.trendingContents,
  );

  const onGroupTabClick = () => {
    setTab('group');
    localStorage.setItem('mainTab', 'group');
  };

  const onContentTabClick = () => {
    setTab('content');
    localStorage.setItem('mainTab', 'content');
  };

  const onCreateGroupClick = () => {
    history.push('/group/create');
  };

  const onGroupSearchClick = () => {};
  const onContentSearchClick = () => {};
  const onFilterButtonClick = () => {
    setVisibility(!visibility);
  };

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
                  onClick={onFilterButtonClick}
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
            <div
              className={`main__group-filter ${visibility ? 'visible' : ''}`}
            >
              <div className="main__group-filter--ott">
                <div className="main__group-filter--ott-title">
                  OTT Platform / Membership
                </div>
                <div className="main__group-filter--ott-option">
                  <img
                    src="/images/netflix.png"
                    alt="netflix"
                    height="40"
                    width="40"
                  />
                  <div className="main__group-filter--button">Basic</div>
                  <div className="main__group-filter--button">Premium</div>
                </div>
                <div className="main__group-filter--ott-option">
                  <img
                    src="/images/watcha.png"
                    alt="watcha"
                    height="40"
                    width="40"
                  />
                  <div className="main__group-filter--button">Basic</div>
                  <div className="main__group-filter--button">Standard</div>
                  <div className="main__group-filter--button">Premium</div>
                </div>
                <div className="main__group-filter--ott-option">
                  <img
                    src="/images/tving.png"
                    alt="tving"
                    height="40"
                    width="40"
                  />
                  <div className="main__group-filter--button">Basic</div>
                </div>
              </div>
              <div className="main__group-filter--setting">
                <div className="main__group-filter--column">
                  <label htmlFor="filter-duration">Duration</label>
                  <select id="filter-duration" name="filter-duration">
                    duration
                  </select>
                </div>
                <div className="main__group-filter--member">
                  <div className="main__group-filter--column">
                    <label htmlFor="sits-left">Sits Left</label>
                    <select id="sits-left" name="sits-left">
                      Sits left
                    </select>
                  </div>
                  <div className="main__group-filter--column">
                    <label htmlFor="total-member">Total Member</label>
                    <select id="total-member" name="total-member">
                      Total member
                    </select>
                  </div>
                </div>
              </div>
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
                return <GroupListItem group={group} key={group.id} />;
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
                  id="content-search-button"
                  className="main__search--search"
                  onClick={onContentSearchClick}
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="main__content-body">
              <div className="main__content-body--title">
                Recommendation Contents
              </div>
              <div className="main__content-body--poster">
                {recommendationContents.slice(0, 4).map((content) => {
                  return <ContentListItem content={content} key={content.id} />;
                })}
              </div>
            </div>
            <div className="main__content-body">
              <div className="main__content-body--title">Trending Contents</div>
              <div className="main__content-body--poster">
                {trendingContents.slice(4, 8).map((content) => {
                  return <ContentListItem content={content} key={content.id} />;
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;
