import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { editGroup, getGroupDetail } from '../../store/GroupStore';
import FieldInfoItem from '../../components/base/FieldInfoItem';
import './GroupEditPage.scss';
import { getLoginStatus } from '../../store/AuthStore';

const GroupEditPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group.selectedGroup);
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState(0);
  const [passwordConfirm, setPasswordConfirm] = useState(0);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const [accountBank, setAccountBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  let { id } = match.params;
  id = parseInt(id, 10);

  useEffect(() => {
    dispatch(getGroupDetail(id));
    dispatch(getLoginStatus());
  }, []);
  useEffect(() => {
    if (group.id && user.id) {
      if (group.leader.id !== user.id) {
        history.goBack();
      }
    }
  }, [group, user]);

  useEffect(() => {
    if (group.id) {
      setTitle(group.name);
      setDescription(group.description);
      setIsPublic(group.isPublic);
      setPassword(group.password);
      setAccountBank(group.accountBank);
      setAccountNumber(group.accountNumber);
      setAccountName(group.accountName);
    }
  }, [group]);

  const onBackClick = () => {
    history.goBack();
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

  const onCancelClick = () => {
    history.push('/main/');
  };

  const onEditGroupClick = () => {
    const editedGroupInfo = {
      name: title,
      description,
      isPublic,
      password,
      accountBank,
      accountNumber,
      accountName,
    };
    dispatch(editGroup(id, editedGroupInfo));
  };

  const platformContent = (
    <div className="platform__text">
      {group.platform ? <>{group.platform}</> : <></>}
    </div>
  );
  const membershipContent = (
    <div className="membership__text">
      {group.membership ? <>{group.membership}</> : <></>}
    </div>
  );
  const peopleContent = (
    <div className="people__text">
      {group.maxPeople ? <>{group.maxPeople}</> : <>0</>}
    </div>
  );
  const costContent = (
    <div className="cost__text">
      {group.maxPeople ? (
        <>
          {Math.floor(group.cost / group.maxPeople)
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
        key={accountBank}
        value={accountBank}
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

  return (
    <div className="groupedit">
      <button id="back-button" onClick={onBackClick} type="button">
        &#9664; Back
      </button>
      <div className="groupedit__main">
        <div className="groupedit__header">
          {group.platform ? (
            <img
              className="groupedit__ottlogo"
              src={'/images/'.concat(group.platform.toLowerCase(), '.png')}
              alt="logo"
            />
          ) : (
            <></>
          )}
          <input
            id="groupedit-title-input"
            name="group-title"
            type="text"
            value={title}
            onChange={onTitleChange}
          />
        </div>
        <div className="groupedit__membership">
          <div className="groupedit__membership__header">
            <h1 className="groupedit__membership__info">Membership Info</h1>
          </div>
          <div className="groupedit__membership__body">
            <FieldInfoItem container="groupedit" category="OTT" content={platformContent} section="membership" />
            <FieldInfoItem container="groupedit" category="Membership" content={membershipContent} section="membership" />
            <FieldInfoItem container="groupedit" category="People" content={peopleContent} section="membership" />
            <FieldInfoItem container="groupedit" category="Cost" content={costContent} section="membership" />
            <FieldInfoItem container="groupedit" category="Public" content={isPublicContent} section="membership" />
            {isPublic
              ? null
              : <FieldInfoItem container="groupedit" category="Password" content={passwordContent} section="membership" />}
          </div>
        </div>
        <hr />
        <div className="groupedit__group">
          <div className="groupedit__group__header">
            <h1 className="groupedit__group__info">Group Info</h1>
          </div>
          <div className="groupedit__group__body">
            <FieldInfoItem container="groupedit" category="Description" content={descriptionInputContent} section="group" />
            <FieldInfoItem container="groupedit" category="Account" content={accountInputContent} section="group" />
          </div>
        </div>
        <div className="groupedit__buttons">
          <button id="cancel-button" onClick={onCancelClick} type="button">
            Cancel
          </button>
          <button
            id="edit-group-button"
            onClick={onEditGroupClick}
            type="button"
            disabled={
              !group.id ||
              (
                title === group.name &&
                isPublic === group.isPublic &&
                password === group.password &&
                description === group.description &&
                accountBank === group.accountBank &&
                accountName === group.accountName &&
                accountNumber === group.accountNumber
              )
            }
          >
            Edit Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupEditPage;
