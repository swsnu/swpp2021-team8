import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accountBank, setAccountBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payday, setPayday] = useState('');

  const checkPasswordEqual = () => {
    if (password === passwordConfirm) {
      setIsPasswordEqual(true);
    } else {
      setIsPasswordEqual(false);
    }
  };
  const checkPasswordValid = () => {
    if (
      password.match(/[0-9]{4}/)
    ) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };
  useEffect(() => {
    checkPasswordValid();
    checkPasswordEqual();
  }, [password, passwordConfirm]);

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

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onPasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onAccountBankChange = (e) => {
    setAccountBank(e.target.value);
  };

  const onAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const onAccountNameChange = (e) => {
    setAccountName(e.target.value);
  };

  const onPaydayChange = (e) => {
    setPayday(e.target.value);
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
    const checked = selectedOtt ? selectedOtt.name === ott.name : false;
    return (
      <div className="ott__content__component">
        <input
          id={ott.name.concat('-logo-button')}
          className={'groupcreate__ott '.concat(ott.name.toLowerCase())}
          type="radio"
          name="ott"
          value={ott.name}
          checked={checked}
          onChange={onOttSelect}
        />
        <label htmlFor={ott.name.concat('-logo-button')}>
          <img className={checked ? 'logo checked' : 'logo unchecked'} src={ott.logo} alt={ott.name.concat('-logo')} />
        </label>
      </div>
    );
  });
  const membershipSelectContent = (
    <select
      id="membership-select"
      name="membership"
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
              {Math.floor(selectedOtt.cost / people).toString().concat(' Won')}
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
      <input id="password-input" name="password" type="password" onChange={onPasswordChange} />
      <input id="password-confirm-input" name="password-confirm" type="password" onChange={onPasswordConfirmChange} />
      <div className="password-validcheck">
        <span>
          {isPasswordValid ? (
            <FaCheckCircle style={{ color: 'green' }} />
          ) : (
            <FaTimesCircle style={{ color: 'red' }} />
          )}
        </span>
        4 digits
      </div>
      <div className="password-equalcheck">
        <span>
          {isPasswordEqual ? (
            <FaCheckCircle style={{ color: 'green' }} />
          ) : (
            <FaTimesCircle style={{ color: 'red' }} />
          )}
        </span>
        password match
      </div>
    </>
  );
  const titleInputContent = (
    <>
      <input
        id="group-title-input"
        name="group-title"
        type="text"
        value="Enter group title"
        onChange={onTitleChange}
      />
    </>
  );
  const descriptionInputContent = (
    <>
      <textarea
        id="description-input"
        name="description"
        type="text"
        value="Enter group description"
        onChange={onDescriptionChange}
      />
    </>
  );
  const accountInputContent = (
    <>
      <select
        id="acoount-bank-select"
        name="account-bank"
        type="text"
        onChange={onAccountBankChange}
      >
        <option value="KB">KB</option>
        <option value="Woori">Woori</option>
        <option value="NH">NH</option>
        <option value="Shinhan">Shinhan</option>
      </select>
      <input
        id="account-number-input"
        name="account-number"
        type="text"
        value="Enter your account number"
        onChange={onAccountNumberChange}
      />
      <input
        id="account-name-input"
        name="account-name"
        type="text"
        value="Enter your account name"
        onChange={onAccountNameChange}
      />
    </>
  );
  const paydayOptions = [...Array(31).keys()].map((day) => {
    return <option value={day + 1}>{day + 1}</option>;
  });
  const paydayInputContent = (
    <>
      <select
        id="payday-select"
        name="payday"
        type="number"
        onChange={onPaydayChange}
      >
        {paydayOptions}
      </select>
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
            <h1 className="groupcreate__membership__info">
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
        <hr />
        <div className="groupcreate__group">
          <div className="groupcreate__group__header">
            <h1 className="groupcreate__group__info">
              Group Info
            </h1>
          </div>
          <div className="groupcreate__group__body">
            {renderField('Title', titleInputContent, 'group')}
            {renderField('Description', descriptionInputContent, 'group')}
            {renderField('Account', accountInputContent, 'group')}
            {renderField('Payday', paydayInputContent, 'group')}
          </div>
          {title}
          {description}
          {accountBank}
          {accountNumber}
          {accountName}
          {payday}
        </div>
        <div className="groupcreate__buttons">
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
