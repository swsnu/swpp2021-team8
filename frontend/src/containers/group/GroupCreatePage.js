import React, { useState } from 'react';
import netflixLogo from './temp/netflixLogo.png';
import watchaLogo from './temp/watchaLogo.png';
import tvingLogo from './temp/tvingLogo.png';
import './GroupCreatePage.scss';

const GroupCreatePage = ({ history }) => {
  const ottList = [
    {
      name: 'Netflix',
      logo: netflixLogo,
      max_people: 4,
      cost: 14500,
    },
    {
      name: 'Watcha',
      logo: watchaLogo,
      max_people: 4,
      cost: 12900,
    },
    {
      name: 'Tving',
      logo: tvingLogo,
      max_people: 4,
      cost: 13900,
    },
  ];
  const [selectedOtt, setSelectedOtt] = useState(null);
  const [membership, setMembership] = useState(null);
  const [people, setPeople] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const onBackClick = () => {
    history.goBack();
  };

  const onOttSelect = (e) => {
    setSelectedOtt(ottList.find((ott) => {
      return ott.name === e.target.value;
    }));
  };

  const onMembershipSelect = (e) => {
    setMembership(e.target.value);
  };

  const onPeopleSelect = (e) => {
    setPeople(e.target.value);
  };

  const onPublicToggle = () => {
    setIsPublic(!isPublic);
  };
  const onCancelClick = () => {
    // TODO
  };

  const onCreateGroupClick = () => {
    // TODO
  };
  const renderField = (category, content, section = 'membership') => {
    const classname = 'groupcreate__'.concat(section, '__field ', category.toLowerCase());
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
  const ottSelectContent = ottList.map((ott) => {
    return (
      <>
        <input
          id={ott.name.concat('-logo-button')}
          className={'groupcreate__ott '.concat(ott.name.toLowerCase())}
          type="radio"
          name="ott"
          value={ott.name}
          checked={selectedOtt === ott}
          onChange={onOttSelect}
        />
        <label htmlFor={ott.name.concat('-logo-button')}>
          <img className="logo" src={ott.logo} alt={ott.name.concat('-logo')} />
        </label>
      </>
    );
  });
  const membershipSelectContent = (
    <select
      id="membership-select"
      name="membership"
      value="Select Membership"
      onChange={onMembershipSelect}
      disabled={!selectedOtt}
    >
      <option value="Basic">
        Basic
      </option>
      <option value="Standard">
        Standard
      </option>
      <option value="Premium">
        Premium
      </option>
    </select>
  );
  const peopleSelectContent = (
    <select
      id="people-select"
      name="membership"
      onChange={onPeopleSelect}
      disabled={!membership}
    >
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
    </select>
  );
  const costContent = (
    <div className="cost__text">
      {
        selectedOtt && membership && people ?
          (
            <>
              {selectedOtt.cost / people}
              Won
            </>
          )
          :
          (
            <>
              0 Won
            </>
          )
      }
    </div>
  );
  const isPublicContent = (
    <>
      <input type="checkbox" name="public" id="public-input" onChange={onPublicToggle} />
      <label htmlFor="public-input" className="round-slider-container">
        <div />
        <div />
        <div className="round-slider" />
      </label>
    </>
  );
  const passwordContent = (
    <>
      <input id="password-input" name="password" type="password" />
      <input id="password-confirm-input" name="password-confirm" type="password" />
    </>
  );
  return (
    <div className="groupcreate">
      <button id="back-button" onClick={onBackClick} type="button">
        &#9664; Back
      </button>
      <div className="groupcreate__main">
        <div className="groupcreate__membership">
          <div className="groupcreate__membership__header">
            <h1 className="groupcreate__info">
              Membership Info
            </h1>
          </div>
          <div className="groupcreate__membership__body">
            {renderField('OTT', ottSelectContent, 'membership')}
            {renderField('Membership', membershipSelectContent, 'membership')}
            {renderField('People', peopleSelectContent, 'membership')}
            {renderField('Cost', costContent, 'membership')}
            {renderField('Public', isPublicContent, 'membership')}
            {
              isPublic ?
                (
                  null
                )
                :
                (
                  renderField('Password', passwordContent, 'membership')
                )
            }
          </div>
        </div>
        <div className="groupcreate__group">
          <input id="group-title-input" name="group-title" type="text" />
          <input id="description-input" name="description" type="text" />
          <select id="account-bank-select">account bank TODO</select>
          <input id="account-number-input" name="account-number" type="text" />
          <input id="account-name-input" name="account-name" type="text" />
          <button id="cancel-button" onClick={onCancelClick} type="button">
            Cancel
          </button>
          <button
            id="create-group-button"
            onClick={onCreateGroupClick}
            type="button"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreatePage;
