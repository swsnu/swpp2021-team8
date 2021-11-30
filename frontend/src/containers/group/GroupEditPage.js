import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editGroup, getGroupDetail } from '../../store/GroupStore';

const GroupEditPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group.selectedGroup);

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
  }, []);

  useEffect(() => {
    setTitle(group.title);
    setDescription(group.description);
    setIsPublic(group.isPublic);
    setPassword(group.password);
    setAccountBank(group.accountBank);
    setAccountNumber(group.accountNumber);
    setAccountName(group.accountName);
  }, [group]);

  const onBackClick = () => {
    history.goBack();
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

  const onCancelClick = () => {
    history.push('/main/');
  };

  const onConfirmClick = () => {
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

  return (
    <div className="groupedit">
      <button id="back-button" onClick={onBackClick} type="button">
        Back
      </button>
      <div className="groupediit__main">
        
      </div>
      <select id="people-select">people TODO</select>
      <input id="public-input" name="public" type="checkbox" />
      <input id="password-input" name="password" type="password" onClick={onPasswordChange} />
      <input
        id="password-confirm-input"
        name="password-confirm"
        type="password"
      />
      <input id="group-title-input" name="group-title" type="text" />
      <input id="description-input" name="description" type="text" />
      <select id="account-bank-select">account bank TODO</select>
      <input id="account-number-input" name="account-number" type="text" />
      <input id="account-name-input" name="account-name" type="text" />
      <button id="cancel-button" onClick={onCancelClick} type="button">
        Cancel
      </button>
      <button id="confirm-button" onClick={onConfirmClick} type="button">
        Confirm
      </button>
    </>
  );
};

export default GroupEditPage;
