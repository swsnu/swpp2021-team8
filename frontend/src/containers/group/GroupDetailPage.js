import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGroupDetail,
  addUserToGroup,
  deleteUserFromGroup,
  deleteGroup,
} from '../../store/GroupStore';
import { getLoginStatus } from '../../store/AuthStore';
import FieldInfoItem from '../../components/base/FieldInfoItem';
import './GroupDetailPage.scss';
import Loading from '../../components/base/Loading';

const GroupDetailPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group.selectedGroup);
  const user = useSelector((state) => state.auth.user);

  const [deletedDate, setDeletedDate] = useState(new Date());

  const id = parseInt(match.params.id, 10);

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dispatch(getGroupDetail(id));
  }, []);

  useEffect(() => {
    dispatch(getLoginStatus());

    if (group.willBeDeleted) {
      const targetDate = new Date();
      // e.g today is 23, payday - 1 is 3 smaller than today
      if (targetDate.getDate() >= group.payday - 1) {
        targetDate.setMonth(targetDate.getMonth() + 1);
      }

      targetDate.setDate(
        Math.min(
          group.payday - 1,
          new Date(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1,
            0,
          ).getDate(),
        ),
      );

      targetDate.setHours(0);
      targetDate.setMinutes(0);
      targetDate.setSeconds(0);

      setDeletedDate(targetDate);
    }
  }, [group]);

  const onBackClick = () => {
    history.goBack();
  };

  const onJoinClick = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you want to join this group?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, join it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!group.isPublic) {
          MySwal.fire({
            title: 'This is a Private Group.',
            text: 'Submit your Password (ex: 0000)',
            input: 'text',
            showCancelButton: true,
          }).then((result2) => {
            if (result2.value === group.password.toString()) {
              dispatch(addUserToGroup(group));
              MySwal.fire(
                'Success!',
                'You have successfully joined this group!',
                'success',
              );
            } else {
              MySwal.fire(
                'Wrong Password!',
              );
            }
          });
        } else {
          dispatch(addUserToGroup(group));
          MySwal.fire(
            'Success!',
            'You have successfully joined this group!',
            'success',
          );
        }
      }
    });
  };

  const onQuitClick = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you want to quit this group?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, quit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUserFromGroup(group));
        MySwal.fire(
          'Success!',
          'You have successfully quited this group!',
          'success',
        );
      }
    });
  };

  const onEditClick = () => {
    history.push(`/group/${group.id}/edit/`);
  };

  const onDeleteClick = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this group? This can't be undone!",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteGroup(group.id));
        history.push('/main/');
        MySwal.fire(
          'Success!',
          'You have successfully Delete this group! This group will be deleted before next payday!',
          'success',
        );
      }
    });
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
            <Text
              style={{ color: 'white', width: '60px', marginTop: '5px' }}
              numberOfLines={1}
            >
              {member.username}
            </Text>
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

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span>{`${days}days ${hours}:${minutes}:${seconds} left until delete`}</span>
    );
  };

  return (
    <>
      {group && group.id === id ? (
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
              <FieldInfoItem
                container="groupdetail"
                category="Membership"
                content={group.membership}
              />
              <FieldInfoItem
                container="groupdetail"
                category="Cost"
                content={cost.toString().concat(' Won')}
              />
              <FieldInfoItem
                container="groupdetail"
                category="People"
                content={group.currentPeople}
              />
              <FieldInfoItem
                container="groupdetail"
                category="Members"
                content={members}
              />
              <>
                {group.members &&
                group.members.find((member) => member.id === user.id) ? (
                  <FieldInfoItem
                    container="groupdetail"
                    category="Account"
                    content={account}
                  />
                ) : (
                  <></>
                )}
              </>
              <FieldInfoItem
                container="groupdetail"
                category="Payday"
                content={payday}
              />
              <FieldInfoItem
                container="groupdetail"
                category="Description"
                content={group.description}
              />
            </div>
            <div className="groupdetail__footer">
              {group.leader && group.leader.id !== user.id ? (
                <>
                  {group.members &&
                  group.members.find((member) => member.id === user.id) ? (
                    <button
                      id="quit-button"
                      onClick={onQuitClick}
                      type="button"
                    >
                      Quit
                    </button>
                  ) : (
                    <>
                      {group.currentPeople < group.maxPeople ? (
                        <button
                          id="join-button"
                          onClick={onJoinClick}
                          type="button"
                        >
                          Join
                        </button>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}

              {group.leader &&
              group.leader.id === user.id &&
              !group.willBeDeleted ? (
                <>
                  <button id="edit-button" onClick={onEditClick} type="button">
                    Edit
                  </button>
                  <button
                    id="delete-button"
                    onClick={onDeleteClick}
                    type="button"
                  >
                    Delete
                  </button>
                </>
              ) : null}

              {group.willBeDeleted && deletedDate > Date.now() ? (
                <div className="groupdetail__timer">
                  <div className="groupdetail__timer__title">
                    {`This will be deleted at <${deletedDate.toDateString()}>!!`}
                  </div>
                  <div className="groupdetail__timer__countdown">
                    <Countdown date={deletedDate} renderer={renderer} />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default GroupDetailPage;
