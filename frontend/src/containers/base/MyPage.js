import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from '../../components/base/Calendar';
import ContentListItem from '../../components/content/ContentListItem';
import GroupListItem from '../../components/group/GroupListItem';
import { getFavoriteContents } from '../../store/ContentStore';
import { getGroups } from '../../store/GroupStore';
import './MyPage.scss';

const MyPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const groups = useSelector((state) => state.group.groups);
  const favoriteContents = useSelector(
    (state) => state.content.favoriteContents,
  );

  // Group Pagination
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getGroups(`id=${user.id}`));
    dispatch(getFavoriteContents(user.id));
  }, []);

  useEffect(() => {
    setPageCount(Math.ceil(groups.length / itemsPerPage));
  }, [groups]);

  // Invoke when user click to request another page.
  const onHandlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % groups.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="mypage">
      <div className="mypage__info">
        <h1> My Page </h1>
        <div className="mypage__info__username">
          <h2 className="category">username</h2>
          <h2 className="content">{user.username}</h2>
        </div>
      </div>
      <div className="mypage__content">
        <div className="mypage__grouplist">
          <h2>My Group</h2>
          {groups.slice(itemOffset, itemOffset + itemsPerPage).map((group) => {
            return (
              <GroupListItem
                group={group}
                key={`group_${group.id}`}
                onlyTitle
              />
            );
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
        <hr />
        <div className="mypage__calendar">
          <h2>Calendar</h2>
          <Calendar groups={groups} />
        </div>
      </div>
      <div className="mypage__favorite">
        <div className="mypage__favorite__title">Favorite Contents</div>
        {favoriteContents.map((content) => {
          return (
            <ContentListItem content={content} key={`content_${content.id}`} />
          );
        })}
      </div>
    </div>
  );
};

export default MyPage;
