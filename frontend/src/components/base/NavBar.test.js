import React from 'react';
import { shallow } from 'enzyme';
import NavBar from './NavBar';

describe('<NavBar />', () => {
  it('should render without error when nothing is passed', () => {
    const component = shallow(<NavBar.WrappedComponent />);

    expect(component.find('.navbar').length).toBe(1);
    expect(component.find('.navbar__auth').length).toBe(0);
  });

  it('should render without error when user is NOT logged in ', () => {
    const component = shallow(<NavBar.WrappedComponent isLoggedIn={false} />);

    expect(component.find('.navbar').length).toBe(1);
    expect(component.find('.navbar__auth').length).toBe(0);
  });

  it('should render without error when user is logged in ', () => {
    const component = shallow(<NavBar.WrappedComponent isLoggedIn={true} />);

    expect(component.find('.navbar__auth').length).toBe(1);
  });

  it('should push history when clicks logo or mypage', () => {
    const history = jest.fn(() => {});
    history.push = jest.fn((url) => {});
    const component = shallow(
      <NavBar.WrappedComponent history={history} isLoggedIn={true} />,
    );

    const logo_wrapper = component.find('.navbar__logo');
    logo_wrapper.simulate('click');
    expect(history.push).toHaveBeenCalledWith('/main');

    const mypage_wrapper = component.find('.navbar__auth--mypage');
    mypage_wrapper.simulate('click');
    expect(history.push).toHaveBeenCalledWith('/mypage');
  });

  it('should call back logOutClick function when Logout button is clicked', () => {
    const mockLogOutClick = jest.fn(() => {});
    const component = shallow(
      <NavBar.WrappedComponent
        isLoggedIn={true}
        onLogOutClick={mockLogOutClick}
      />,
    );

    const logout_wrapper = component.find('#logout-button');
    logout_wrapper.simulate('click');
    expect(mockLogOutClick).toHaveBeenCalledTimes(1);
  });
});
