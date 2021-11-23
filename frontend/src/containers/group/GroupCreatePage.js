import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { createGroup } from '../../store/GroupStore';
import { getOtts, getOttPlan } from '../../store/OttStore';
import './GroupCreatePage.scss';

const GroupCreatePage = ({ history }) => {
  const [platform, setPlatform] = useState(null);
  const [membership, setMembership] = useState('Basic');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState(0);
  const [passwordConfirm, setPasswordConfirm] = useState(0);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accountBank, setAccountBank] = useState('NongHyeop');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payday, setPayday] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOtts());
  }, []);
  useEffect(() => {
    dispatch(getOttPlan(platform, membership));
  }, [platform, membership]);
  const ottList = useSelector((state) => state.ott.otts);
  const ottPlan = useSelector((state) => state.ott.selectedOttPlan);

  const onBackClick = () => {
    history.goBack();
  };

  const onPlatformSelect = (e) => {
    setPlatform(
      ottList.find((ott) => {
        return ott.name === e.target.value;
      }),
    );
  };
  const onMembershipSelect = (e) => {
    setMembership(e.target.value);
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
  const checkPasswordEqual = () => {
    if (password === passwordConfirm) {
      setIsPasswordEqual(true);
    } else {
      setIsPasswordEqual(false);
    }
  };
  const checkPasswordValid = () => {
    if (password.toString().match(/[0-9]{4}/)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };
  useEffect(() => {
    checkPasswordValid();
    checkPasswordEqual();
  }, [password, passwordConfirm]);

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
    history.push('/main');
  };
  const onCreateGroupClick = () => {
    dispatch(
      createGroup({
        name: title,
        description,
        isPublic,
        password,
        ottPlanId: ottPlan.id,
        payday,
        accountBank,
        accountNumber,
        accountName,
      }),
    );
    history.push('/main/');
  };

  const renderField = (category, content, section) => {
    const classname = 'groupcreate__'.concat(
      section,
      '__field ',
      category.toLowerCase(),
    );
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
  const platformSelectContent = ottList.map((ott) => {
    const checked = platform ? platform.name === ott.name : false;
    return (
      <div className="ott__content__component">
        <input
          id={ott.name.toLowerCase().concat('-logo-button')}
          className={'groupcreate__ott '.concat(ott.name.toLowerCase())}
          type="radio"
          name="ott"
          value={ott.name}
          checked={checked}
          onChange={onPlatformSelect}
        />
        <label htmlFor={ott.name.toLowerCase().concat('-logo-button')}>
          <img
            className={checked ? 'logo checked' : 'logo unchecked'}
            src={`images/${ott.name.toLowerCase()}.png`}
            alt={ott.name.toLowerCase().concat('-logo')}
          />
        </label>
      </div>
    );
  });
  const membershipSelectContent = (
    <select
      id="membership-select"
      name="membership"
      onChange={onMembershipSelect}
      disabled={!platform}
    >
      <option value="Basic">Basic</option>
      <option value="Standard">Standard</option>
      <option value="Premium">Premium</option>
    </select>
  );
  const peopleContent = (
    <div className="people__text">
      {ottPlan && ottPlan.maxPeople ? <>{ottPlan.maxPeople}</> : <>0</>}
    </div>
  );
  const costContent = (
    <div className="cost__text">
      {ottPlan && ottPlan.cost ? (
        <>
          {Math.floor(ottPlan.cost / ottPlan.maxPeople)
            .toString()
            .concat(' Won')}
        </>
      ) : (
        <>0 Won</>
      )}
    </div>
  );
  const isPublicContent = (
    <>
      <input
        type="checkbox"
        name="public"
        id="public-input"
        onChange={onPublicToggle}
      />
      <label htmlFor="public-input" className="round-slider-container">
        <div />
        <div />
        <div className="round-slider" />
      </label>
    </>
  );
  const passwordContent = (
    <>
      <input
        id="password-input"
        name="password"
        type="password"
        onChange={onPasswordChange}
      />
      <input
        id="password-confirm-input"
        name="password-confirm"
        type="password"
        onChange={onPasswordConfirmChange}
      />
      <div className="password-validcheck">
        <span>
          {isPasswordValid ? (
            <FaCheckCircle className="isvalid" style={{ color: 'green' }} />
          ) : (
            <FaTimesCircle className="isnotvalid" style={{ color: 'red' }} />
          )}
        </span>
        4 digits
      </div>
      <div className="password-equalcheck">
        <span>
          {isPasswordEqual ? (
            <FaCheckCircle className="isequal" style={{ color: 'green' }} />
          ) : (
            <FaTimesCircle className="isnotequal" style={{ color: 'red' }} />
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
        value={title}
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
        value={description}
        onChange={onDescriptionChange}
      />
    </>
  );
  const accountInputContent = (
    <>
      <select
        id="account-bank-select"
        name="account-bank"
        type="text"
        onChange={onAccountBankChange}
      >
        <option value="NongHyup">NongHyup</option>
        <option value="KookMin">KookMin</option>
        <option value="Shinhan">Shinhan</option>
        <option value="Woori">Woori</option>
        <option value="IBK">IBK</option>
        <option value="Hana">Hana</option>
        <option value="Saemaeul">Saemaeul</option>
        <option value="DaegooBank">DaegooBank</option>
        <option value="PostOffice">PostOffice</option>
        <option value="Toss">Toss</option>
        <option value="CitiBank">CitiBank</option>
        <option value="KDB">KDB</option>
      </select>
      <input
        id="account-number-input"
        name="account-number"
        type="text"
        value={accountNumber}
        onChange={onAccountNumberChange}
      />
      <input
        id="account-name-input"
        name="account-name"
        type="text"
        value={accountName}
        onChange={onAccountNameChange}
      />
    </>
  );
  const paydayOptions = [...Array(31).keys()].map((day) => {
    return (
      <option value={day + 1} key={`payday_${day + 1}`}>
        {day + 1}
      </option>
    );
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
            <h1 className="groupcreate__membership__info">Membership Info</h1>
          </div>
          <div className="groupcreate__membership__body">
            {renderField('OTT', platformSelectContent, 'membership')}
            {renderField('Membership', membershipSelectContent, 'membership')}
            {renderField('People', peopleContent, 'membership')}
            {renderField('Cost', costContent, 'membership')}
            {renderField('Public', isPublicContent, 'membership')}
            {isPublic
              ? null
              : renderField('Password', passwordContent, 'membership')}
          </div>
        </div>
        <hr />
        <div className="groupcreate__group">
          <div className="groupcreate__group__header">
            <h1 className="groupcreate__group__info">Group Info</h1>
          </div>
          <div className="groupcreate__group__body">
            {renderField('Title', titleInputContent, 'group')}
            {renderField('Description', descriptionInputContent, 'group')}
            {renderField('Account', accountInputContent, 'group')}
            {renderField('Payday', paydayInputContent, 'group')}
          </div>
        </div>
        <div className="groupcreate__buttons">
          <button id="cancel-button" onClick={onCancelClick} type="button">
            Cancel
          </button>
          <button
            id="create-group-button"
            onClick={onCreateGroupClick}
            type="button"
            disabled={
              !ottPlan ||
              !title ||
              !description ||
              !accountBank ||
              !accountName ||
              !accountNumber
            }
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreatePage;
