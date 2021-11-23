import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGroupDetail,
  addUserToGroup,
  deleteUserFromGroup,
  deleteGroup,
} from '../../store/GroupStore';
import './GroupDetailPage.scss';

const GroupDetailPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group.selectedGroup);
  const user = {
    id: 1,
    username: 'swpp1',
  };
  let { id } = match.params;
  id = parseInt(id, 10);
  useEffect(() => {
    dispatch(getGroupDetail(id));
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
    ? group.members.map((member) => {
      return (
        <div className="groupdetail__member">
          <div className="groupdetail__member__index" />
          <div className="groupdetail__member__username">
            {member.username}
          </div>
        </div>
      );
    })
    : null;
  const empty = (
    <div className="groupdetail__member--empty">
      <div className="groupdetail__member__index--empty" />
    </div>
  );
  for (let i = group.currentPeople; i < group.maxPeople; i += 1) {
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
  const renderField = (category, content) => {
    const classname = 'groupdetail__field '.concat(category.toLowerCase());
    return (
      <div className={classname}>
        <div className={category.toLowerCase().concat(' category')}>
          {category}
        </div>
        <div className={category.toLowerCase().concat(' content')}>
          {content}
        </div>
      </div>
    );
  };
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
              src={
                group.platform
                  ? `/images/${group.platform.toLowerCase()}.png/`
                  : null
              }
              alt="logo"
            />
          ) : (
            <></>
          )}
          <h1 className="groupdetail__name">{group.name}</h1>
        </div>
        <div className="groupdetail__body">
          {renderField('Membership', group.membership)}
          {renderField('Cost', cost.toString().concat(' Won'))}
          {renderField('People', group.currentPeople)}
          {renderField('Members', members)}
          {renderField('Account\nInfo', account)}
          {renderField('Payday', payday)}
          {renderField('Description', group.description)}
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
