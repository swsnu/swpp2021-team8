import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   getGroupDetail,
//   addUserToGroup,
//   deleteUserFromGroup,
//   deleteGroup,
// } from '../../store/GroupStore';
import './GroupDetailPage.scss';
import ottLogo from './temp/netflix_macos_bigsur_icon_189917.png';

const GroupDetailPage = ({ history }) => {
  // const dispatch = useDispatch();
  // dispatch(getGroupDetail(props.match.params.id));
  // const group = useSelector((state) => state.group.selectedGroup);
  const user = {
    id: 1,
    username: 'swpp',
  };
  const [group, setGroup] = useState({
    id: 1,
    membership: {
      ott: 'Netflix',
      logo: ottLogo,
      membership: 'Premium',
      max_people: 4,
      cost: 10000,
    },
    payday: 1,
    current_people: 3,
    members: [
      {
        id: 2,
        username: 'bravo',
      },
      {
        id: 3,
        username: 'charlie',
      },
      {
        id: 4,
        username: 'delta',
      },
    ],
    is_public: true,
    password: -1,
    name: 'Netfix Lovers',
    description: 'We love Netflix!\nWe love you!',
    account_bank: 'Woori',
    account_number: '34927-49827-324593',
    account_name: 'Hong Gildong',
    leader: {
      id: 2,
      username: 'noFatherNoBrother',
    },
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    will_be_deleted: false,
  });
  const onBackClick = () => {
    history.goBack();
  };
  const onJoinClick = () => {
    // dispatch(addUserToGroup(group.id, user.id));
    setGroup({
      ...group,
      current_people: group.current_people + 1,
      members: [...group.members, user],
    });
  };
  const onQuitClick = () => {
    // dispatch(deleteUserFromGroup(group.id, user.id));
    setGroup({
      ...group,
      current_people: group.current_people - 1,
      members: group.members.filter((member) => {
        return member.id !== user.id;
      }),
    });
  };
  const onEditClick = () => {
    // TODO
    // history.push(`/group/${group.id}/edit`);
  };

  const onDeleteClick = () => {
    // TODO
    // dispatch(deleteGroup(props.match.params.id));
  };
  let members = group.members.map((member) => {
    return (
      <div className="groupdetail__member">
        <div className="groupdetail__member__index" />
        <div className="groupdetail__member__username">
          {member.username}
        </div>
      </div>
    );
  });
  const available = group.membership.max_people - group.current_people;
  const empty = (
    <div className="groupdetail__member--empty">
      <div className="groupdetail__member__index--empty" />
    </div>
  );
  for (let i = 0; i < available; i += 1) {
    members = [...members, empty];
  }
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
  const cost = Math.floor(group.membership.cost / group.current_people);
  return (
    <div className="groupdetail">
      <button id="back-button" onClick={onBackClick} type="button">
        &#9664; Back
      </button>
      <div className="groupdetail__main">
        <div className="groupdetail__header">
          <img className="groupdetail__ottlogo" src={group.membership.logo} alt="logo" />
          <h1 className="groupdetail__name">
            {group.name}
          </h1>
        </div>
        <div className="groupdetail__body">
          {renderField('Membership', group.membership.membership)}
          {renderField('Cost', cost.toString().concat(' Won'))}
          {renderField('People', group.current_people)}
          {renderField('Members', members)}
          {renderField('Account\nInfo', group.account_bank.concat(' ', group.account_number, ' \n', group.account_name))}
          {renderField('Payday', 'Every'.concat(' ', group.payday.toString(), 'th'))}
          {renderField('Description', group.description)}
        </div>
        <div className="groupdetail__footer">
          {
            group.members.find((member) => member.id === user.id) ?
              (
                <button id="quit-button" onClick={onQuitClick} type="button">
                  Quit
                </button>
              ) :
              (
                <button id="join-button" onClick={onJoinClick} type="button">
                  Join
                </button>
              )
          }
          {/* { */}
          {/* group.leader.id === user.id ? */}
          {/* true ? */}
          {/* (
            <> */}
          <button id="edit-button" onClick={onEditClick} type="button">
            Edit
          </button>
          <button id="delete-button" onClick={onDeleteClick} type="button">
            Delete
          </button>
          {/* </> */}
          {/* // ) : null */}
          {/* } */}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
