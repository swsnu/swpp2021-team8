import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGroupDetail,
  addUserToGroup,
  deleteUserFromGroup,
  deleteGroup,
} from '../../store/GroupStore';
import { getLoginStatus } from '../../store/AuthStore';
import RenderField from '../../components/base/RenderField';
import './GroupDetailPage.scss';

const GroupDetailPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group.selectedGroup);
  const user = useSelector((state) => state.auth.user);
  let { id } = match.params;
  id = parseInt(id, 10);
  useEffect(() => {
    dispatch(getGroupDetail(id));
    dispatch(getLoginStatus());
  }, []);
  const onBackClick = () => {
    history.goBack();
  };
  const onJoinClick = () => {
    dispatch(addUserToGroup(group));
  };
  const onQuitClick = () => {
    dispatch(deleteUserFromGroup(group));
  };
  const onEditClick = () => {
    history.push(`/group/${group.id}/edit/`);
  };
  const onDeleteClick = () => {
    dispatch(deleteGroup(group.id));
    history.push('/main/');
  };
  let cost = '';
  let account = '';
  let payday = '';
  let members = group.members
    ? group.members.map((member, index) => {
      return (
        /* eslint react/no-array-index-key: ['off'] */
        <div className="groupdetail__member" key={`member-${index}`}>
          <div className="groupdetail__member__index" />
          <div className="groupdetail__member__username">
            {member.username}
          </div>
        </div>
      );
    })
    : null;
  for (let i = group.currentPeople; i < group.maxPeople; i += 1) {
    const empty = (
      <div className="groupdetail__member--empty" key={`empty-${i}`}>
        <div className="groupdetail__member__index--empty" />
      </div>
    );
    members = [...members, empty];
  }
  cost = Math.floor(
    parseInt(group.cost, 10) / parseInt(group.currentPeople, 10),
  ).toString();
  account = account.concat(
    group.accountBank,
    ' ',
    group.accountNumber,
    ' \n',
    group.accountName,
  );
  payday = group.payday
    ? 'Every'.concat(' ', group.payday.toString(), 'th')
    : 'None';

  return (
    <div className="groupdetail">
      <button id="back-button" onClick={onBackClick} type="button">
        &#9664; Back
      </button>
      <div className="groupdetail__main">
        <div className="groupdetail__header">
          {group.platform ? (
            <img
              className="groupdetail__ottlogo"
              src={'/images/'.concat(group.platform.toLowerCase(), '.png')}
              alt="logo"
            />
          ) : (
            <></>
          )}
          <h1 className="groupdetail__name">{group.name}</h1>
        </div>
        <div className="groupdetail__body">
          <RenderField container="groupdetail" category="Membership" content={group.membership} />
          <RenderField container="groupdetail" category="Cost" content={cost.toString().concat(' Won')} />
          <RenderField container="groupdetail" category="People" content={group.currentPeople} />
          <RenderField container="groupdetail" category="Members" content={members} />
          <RenderField container="groupdetail" category="Account" content={account} />
          <RenderField container="groupdetail" category="Payday" content={payday} />
          <RenderField container="groupdetail" category="Description" content={group.description} />
        </div>
        <div className="groupdetail__footer">
          {group.members &&
          group.members.find((member) => member.id === user.id) ? (
            <button id="quit-button" onClick={onQuitClick} type="button">
              Quit
            </button>
            ) : (
              <button id="join-button" onClick={onJoinClick} type="button">
                Join
              </button>
            )}
          {group.leader && group.leader.id === user.id ? (
            <>
              <button id="edit-button" onClick={onEditClick} type="button">
                Edit
              </button>
              <button id="delete-button" onClick={onDeleteClick} type="button">
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
