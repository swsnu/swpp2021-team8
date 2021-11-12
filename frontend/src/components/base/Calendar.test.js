import React from 'react';
import { mount, shallow } from 'enzyme';
import Calendar from './Calendar';

describe('<Calendar />', () => {
  it('should render without error when user goes to my page ', () => {
    const component = shallow(<Calendar />);
    expect(component.find('.calendar').length).toBe(1);
  });
  it('should change date when user clicks prev and next button', () => {
    const component = mount(<Calendar />);
    component.find('#next-button').simulate('click');
    component.find('#next-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2022.1');
    component.find('#previous-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2021.12');
    component.find('#previous-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2021.11');
  });
  
  it('should render today well', () => {
    const component = mount(<Calendar />);
    expect(component.find('.cell .today').length).toBe(1);
    component.find('#next-button').simulate('click');
    expect(component.find('.today').length).toBe(0);
  });
});
