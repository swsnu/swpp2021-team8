import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import GroupListItem from '../../components/group/GroupListItem';
import ContentListItem from '../../components/content/ContentListItem';
import './MainPage.scss';
import { getGroups } from '../../store/GroupStore';
import {
  getRecommendationContents,
  getSearchContents,
  getTrendingContents,
} from '../../store/ContentStore';

const MainPage = ({ history }) => {
  const [tab, setTab] = useState(
    localStorage.getItem('mainTab') ? localStorage.getItem('mainTab') : 'group',
  );

  const [groupSearchInput, setGroupSearchInput] = useState('');
  const [contentSearchInput, setContentSearchInput] = useState('');

  // filter visibility
  const [visibility, setVisibility] = useState(false);
  const [filterOTT, setFilterOTT] = useState({
    netflix: {
      basic: false,
      premium: false,
    },
    watcha: {
      basic: false,
      standard: false,
      premium: false,
    },
    tving: {
      basic: false,
    },
  });

  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.groups);
  const recommendationContents = useSelector(
    (state) => state.content.recommendationContents,
  );

  const trendingContents = useSelector(
    (state) => state.content.trendingContents,
  );

  const searchContents = useSelector((state) => state.content.searchContents);

  // Group Pagination
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    setPageCount(Math.ceil(groups.length / itemsPerPage));
  }, [groups]);

  // Content Pagination
  const [recommendationItemOffset, setRecommendationItemOffset] = useState(0);
  const [trendingItemOffset, setTrendingItemOffset] = useState(0);
  const [searchItemOffset, setSearchItemOffset] = useState(0);

  useEffect(() => {
    dispatch(getGroups());
    // TODO
    dispatch(getRecommendationContents(1));
    dispatch(getTrendingContents());
  }, []);

  // Invoke when user click to request another page.
  const onHandlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % groups.length;
    setItemOffset(newOffset);
  };

  // Content previous and next button click
  const onContentPreviousClick = (e) => {
    if (e.target.dataset.type === 'recommendation') {
      setRecommendationItemOffset(
        Math.max(recommendationItemOffset - itemsPerPage, 0),
      );
    } else {
      setTrendingItemOffset(Math.max(trendingItemOffset - itemsPerPage, 0));
    } else if (e.target.dataset.type === 'search') {
      setSearchItemOffset(Math.max(searchItemOffset - itemsPerPage, 0));
    }
  };
  const onContentNextClick = (e) => {
    if (e.target.dataset.type === 'recommendation') {
      setRecommendationItemOffset(
        Math.min(
          recommendationItemOffset + itemsPerPage,
          recommendationContents.length - itemsPerPage,
        ),
      );
    } else {
      setTrendingItemOffset(
        Math.min(
          trendingItemOffset + itemsPerPage,
          trendingContents.length - itemsPerPage,
        ),
      );
    } else if (e.target.dataset.type === 'search') {
      setSearchItemOffset(
        Math.min(
          searchItemOffset + itemsPerPage,
          searchContents.length - itemsPerPage,
        ),
      );
    }
  };

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

  const onGroupSearchChange = (e) => {
    setGroupSearchInput(e.target.value);
  };

  const onContentSearchChange = (e) => {
    setContentSearchInput(e.target.value);
  };

  const onGroupSearchClick = () => {
    const queries = [];
    if (groupSearchInput) {
      queries.push(`name=${groupSearchInput}`);
    }

    Object.entries(filterOTT).forEach(([ott, membership]) => {
      Object.entries(membership).forEach(([type, value]) => {
        if (value) {
          queries.push(`ott=${ott}__${type}`);
        }
      });
    });

    dispatch(getGroups(queries.join('&')));
    setVisibility(false);
  };
  const onContentSearchClick = () => {
    dispatch(getSearchContents(contentSearchInput));
  };

  const onFilterButtonClick = () => {
    setVisibility(!visibility);
  };

  const onFilterOTTClick = (e) => {
    const { ott, membership } = e.target.dataset;
    setFilterOTT({
      ...filterOTT,
      [ott]: { ...filterOTT[ott], [membership]: !filterOTT[ott][membership] },
    });
  };

  return (
    <>
      <div className="main">
        <div className="main__header">
          <div
            className={`main__header__tab ${
              tab === 'group' ? 'main__header__active' : ''
            }`}
            onClick={onGroupTabClick}
            role="button"
            tabIndex={0}
          >
            Group
          </div>
          <div
            className={`main__header__tab ${
              tab === 'content' ? 'main__header__active' : ''
            }`}
            onClick={onContentTabClick}
            role="button"
            tabIndex={0}
          >
            Content
          </div>
          <div className="main__header__placeholder" />
        </div>
        {tab === 'group' ? (
          <>
            <div className="main__group-header">
              <div className="main__group-header__search">
                <input
                  id="group-search-input"
                  name="title"
                  placeholder="Search group title / creator"
                  value={groupSearchInput}
                  onChange={onGroupSearchChange}
                />
                <button
                  id="group-filter-button"
                  type="button"
                  className="main__group-header__search__filter"
                  onClick={onFilterButtonClick}
                >
                  <FaFilter />
                </button>
                <button
                  id="group-search-button"
                  className="main__group-header__search__submit"
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
              className={`main__group-filter ${
                visibility ? 'main__group-filter__visible' : ''
              }`}
            >
              <div className="main__group-filter__ott">
                <div className="main__group-filter__ott__title">
                  OTT Platform / Membership
                </div>
                <div className="main__group-filter__ott__option">
                  <img
                    src="/images/netflix.png"
                    alt="netflix"
                    height="40"
                    width="40"
                  />
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.netflix.basic
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="netflix"
                    data-membership="basic"
                  >
                    Basic
                  </div>
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.netflix.premium
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="netflix"
                    data-membership="premium"
                  >
                    Premium
                  </div>
                </div>
                <div className="main__group-filter__ott__option">
                  <img
                    src="/images/watcha.png"
                    alt="watcha"
                    height="40"
                    width="40"
                  />
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.watcha.basic
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="watcha"
                    data-membership="basic"
                  >
                    Basic
                  </div>
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.watcha.standard
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="watcha"
                    data-membership="standard"
                  >
                    Standard
                  </div>
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.watcha.premium
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="watcha"
                    data-membership="premium"
                  >
                    Premium
                  </div>
                </div>
                <div className="main__group-filter__ott__option">
                  <img
                    src="/images/tving.png"
                    alt="tving"
                    height="40"
                    width="40"
                  />
                  <div
                    className={`main__group-filter__ott__option__button ${
                      filterOTT.tving.basic
                        ? 'main__group-filter__ott__option__button--active'
                        : ''
                    }`}
                    onClick={onFilterOTTClick}
                    role="button"
                    tabIndex={0}
                    data-ott="tving"
                    data-membership="basic"
                  >
                    Basic
                  </div>
                </div>
              </div>
            </div>

            <div className="main__group-list">
              <div className="main__group-list__header">
                <div className="group-item__platform">Platform</div>
                <div className="group-item__title">Title / Creator</div>
                <div className="group-item__membership">Membership / Cost</div>
                <div className="group-item__member">Members</div>
                <div className="group-item__payday">Payday</div>
              </div>
              {groups
                .slice(itemOffset, itemOffset + itemsPerPage)
                .map((group) => {
                  return <GroupListItem group={group} key={group.id} />;
                })}
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={onHandlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          </>
        ) : (
          <>
            <div className="main__content-header">
              <div className="main__content-header__search">
                <input
                  id="content-search-input"
                  name="title"
                  placeholder="Search movie title"
                  value={contentSearchInput}
                  onChange={onContentSearchChange}
                />
                <button
                  id="content-search-button"
                  className="main__content-header__search__submit"
                  onClick={onContentSearchClick}
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>

            {searchContents.length !== 0 ? (
              <div className="main__content-list">
                <div className="main__content-list__title">Search Contents</div>
                <div className="main__content-list__poster">
                  <div
                    className="main__content-list__poster__previous"
                    onClick={onContentPreviousClick}
                    role="button"
                    tabIndex={0}
                    data-type="search"
                  >
                    &lt;
                  </div>

                  {searchContents
                    .slice(searchItemOffset, searchItemOffset + itemsPerPage)
                    .map((content) => {
                      return (
                        <ContentListItem content={content} key={content.id} />
                      );
                    })}

                  <div
                    className="main__content-list__poster__next"
                    onClick={onContentNextClick}
                    role="button"
                    tabIndex={0}
                    data-type="search"
                  >
                    &gt;
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            <div className="main__content-list">
              <div className="main__content-list__title">
                Recommendation Contents
              </div>
              <div className="main__content-list__poster">
                <div
                  className="main__content-list__poster__previous"
                  onClick={onContentPreviousClick}
                  role="button"
                  tabIndex={0}
                  data-type="recommendation"
                >
                  &lt;
                </div>

                {recommendationContents
                  .slice(
                    recommendationItemOffset,
                    recommendationItemOffset + itemsPerPage,
                  )
                  .map((content) => {
                    return (
                      <ContentListItem content={content} key={content.id} />
                    );
                  })}

                <div
                  className="main__content-list__poster__next"
                  onClick={onContentNextClick}
                  role="button"
                  tabIndex={0}
                  data-type="recommendation"
                >
                  &gt;
                </div>
              </div>
            </div>
            <div className="main__content-list">
              <div className="main__content-list__title">Trending Contents</div>
              <div className="main__content-list__poster">
                <div
                  className="main__content-list__poster__previous"
                  onClick={onContentPreviousClick}
                  role="button"
                  tabIndex={0}
                  data-type="trending"
                >
                  &lt;
                </div>
                {trendingContents
                  .slice(trendingItemOffset, trendingItemOffset + itemsPerPage)
                  .map((content) => {
                    return (
                      <ContentListItem content={content} key={content.id} />
                    );
                  })}
                <div
                  className="main__content-list__poster__next"
                  onClick={onContentNextClick}
                  role="button"
                  tabIndex={0}
                  data-type="trending"
                >
                  &gt;
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;
