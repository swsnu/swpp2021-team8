import React from 'react';
import Calendar from '../../components/base/Calendar';
import './MyPage.scss';

const MyPage = () => {
  return (
    <>
      <div className="mypage__info">
        <h1> My Page </h1>
        <div className="mypage__info__email">email</div>
        <div className="mypage__info__username">username</div>
      </div>
      <Calendar />
    </>
  );
};

export default MyPage;
