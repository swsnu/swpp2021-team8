import React from 'react';
import Popper from '@mui/material/Popper';
import { mount, shallow } from 'enzyme';
import NavBar from './NavBar';

describe('<NavBar />', () => {
  it('should render without error when user is NOT logged in', () => {
    const component = shallow(
      <NavBar.WrappedComponent
        notifications={[]}
        onNotificationClick={jest.fn(() => {})}
      />,
    );

    expect(component.find('.navbar').length).toBe(1);
    expect(component.find('.navbar__auth').length).toBe(0);
  });

  it('should render without error when user is logged in ', () => {
    const component = shallow(
      <NavBar.WrappedComponent
        isLoggedIn
        notifications={[]}
        onNotificationClick={jest.fn(() => {})}
      />,
    );

    expect(component.find('.navbar__auth').length).toBe(1);
  });

  it('should push history when clicks logo or mypage', () => {
    const history = jest.fn(() => {});
    history.push = jest.fn(() => {});
    const component = shallow(
      <NavBar.WrappedComponent
        history={history}
        isLoggedIn
        notifications={[]}
        onNotificationClick={jest.fn(() => {})}
      />,
    );

    const logoWrapper = component.find('.navbar__logo');
    logoWrapper.simulate('click');
    expect(history.push).toHaveBeenCalledWith('/main');

    const mypageWrapper = component.find('.navbar__auth__mypage');
    mypageWrapper.simulate('click');
    expect(history.push).toHaveBeenCalledWith('/mypage');
  });

  it('should call back logOutClick function when Logout button is clicked', () => {
    const mockLogOutClick = jest.fn(() => {});
    const component = shallow(
      <NavBar.WrappedComponent
        isLoggedIn
        onLogOutClick={mockLogOutClick}
        notifications={[]}
        onNotificationClick={jest.fn(() => {})}
      />,
    );

    const logoutWrapper = component.find('#logout-button');
    logoutWrapper.simulate('click');
    expect(mockLogOutClick).toHaveBeenCalledTimes(1);
  });

  it('should open Popper when badge clicked', () => {
    const mockLogOutClick = jest.fn(() => {});
    const component = mount(
      <NavBar.WrappedComponent
        isLoggedIn
        onLogOutClick={mockLogOutClick}
        notifications={[
          { id: 1, type: 'create', content: 'test', created_at: new Date() },
          { id: 2, type: 'delete', content: 'delete', created_at: new Date() },
          { id: 3, type: 'join', content: 'join', created_at: new Date() },
        ]}
        onNotificationClick={jest.fn(() => {})}
      />,
    );

    const wrapper = component.find('.navbar__auth__notification');
    wrapper.simulate('click');

    expect(component.find(Popper).length).toBe(1);
  });
});
