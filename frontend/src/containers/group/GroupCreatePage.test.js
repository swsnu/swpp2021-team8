import React from 'react';
import { mount } from 'enzyme';
import GroupCreatePage from './GroupCreatePage';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../../store/index';
import store from '../../store'
import { FaCheckCircle } from 'react-icons/fa';

describe('<GroupCreatePage />', () => {
  let mockGroupCreatePage;

  beforeEach(() => {
    mockGroupCreatePage = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={GroupCreatePage} exact />
        </ConnectedRouter>
      </Provider>
    );
    history.goBack = jest.fn(() => {});
    history.push = jest.fn(() => {});
    // redux.useDispatch = jest.fn(() => () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(mockGroupCreatePage);
    expect(component.find(GroupCreatePage).length).toBe(1);
  });

  it('should render fields well', () => {
    const component = mount(mockGroupCreatePage);
    expect(component.find('.ott .category').length).toBe(1);
    expect(component.find('.ott .content').length).toBe(1);
    expect(component.find('.title .category').length).toBe(1);
    expect(component.find('.title .content').length).toBe(1);
  });

  it('should be redirected back when back button is clicked', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#back-button').simulate('click');
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });

  it('should be redirected to the main page when cancel button is clicked', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#cancel-button').simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  it('should check password matchs', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#public-input').simulate('change', {target: {checked: true}});
    expect(component.find('#password-input').length).toBe(1);
    component
        .find('#password-input')
        .simulate('change', {target: {value:'1234'}});
    component
        .find('#password-confirm-input')
        .simulate('change', {target: {value:'1234'}});
    expect(component.find(GroupCreatePage, '.isequal').length).toBe(1);
  });

  it('should check password does not match', () => {
    const component = mount(mockGroupCreatePage);
    component.find('#public-input').simulate('change', {target: {checked: true}});
    expect(component.find('#password-input').length).toBe(1);
    component
        .find('#password-input')
        .simulate('change', {target: {value:'1234'}});
    component
        .find('#password-confirm-input')
        .simulate('change', {target: {value:'1235'}});
    expect(component.find(GroupCreatePage, '.isnotequal').length).toBe(1);
  });

  it('should check ott, membership, people selection', () => {
    const component = mount(mockGroupCreatePage);
    component
        .find('#netflix-logo-button')
        .simulate('change', {target: {value: 'Netflix'}});
    expect(component.find('#membership-select').length).toBe(1);
    component
        .find('#membership-select')
        .simulate('change', {target: {value:'Premium'}});
    expect(component.find('#people-select').length).toBe(1);
    component
        .find('#people-select')
        .simulate('change', {target: {value: 4}});
    expect(component.find('.cost__text').text()).toBe('3625 Won');
  });

  it('should enable group create button when all input changes', () => {
    const component = mount(mockGroupCreatePage);
    component
        .find('#group-title-input')
        .simulate('change', {target: {value: 'title'}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(0);
    component
        .find('#description-input')
        .simulate('change', {target: {value: 'description'}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(0);
    component
        .find('#account-bank-select')
        .simulate('change', {target: {value: 'KB'}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(0);    
    component
        .find('#account-number-input')
        .simulate('change', {target: {value: 'number'}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(0);
    component
        .find('#account-name-input')
        .simulate('change', {target: {value: 'name'}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(0);
    component
        .find('#payday-select')
        .simulate('change', {target: {value: 1}});
    component
        .find('#create-group-button')
        .simulate('click');
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  //   it('should set state well when join, quit button is clicked', () => {
//     const component = mount(mockGroupCreatePage);
//     component.find('#join-button').simulate('click');
//     const wrapper = component.find('.people .content');
//     expect(wrapper.text()).toBe('4');
//     component.find('#quit-button').simulate('click');
//     expect(wrapper.text()).toBe('3');
//   });
}); 