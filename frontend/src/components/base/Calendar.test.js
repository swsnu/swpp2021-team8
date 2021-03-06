import React from 'react';
import { mount, shallow } from 'enzyme';
import Calendar from './Calendar';

describe('<Calendar />', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 10, 14));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('should render without error when user goes to my page ', () => {
    const component = shallow(<Calendar groups={[]} />);
    expect(component.find('.calendar').length).toBe(1);
  });

  it('should change date when user clicks prev and next button', () => {
    const component = mount(<Calendar groups={[]} />);
    component.find('#next-button').simulate('click');
    component.find('#next-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2022.1');
    component.find('#previous-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2021.12');
    component.find('#previous-button').simulate('click');
    expect(component.find('.calendar__header').text()).toBe('2021.11');
  });

  it('should render today well', () => {
    const component = mount(<Calendar groups={[]} />);
    expect(component.find('.cell .today').length).toBe(1);
    component.find('#next-button').simulate('click');
    expect(component.find('.today').length).toBe(0);
  });

  it('should render sunday today well', () => {
    const component = mount(<Calendar groups={[]} />);
    expect(component.find('.sunday .today').length).toBe(1);
  });

  it('should render payday on last day if payday exceeds the last date of month', () => {
    const component = mount(
      <Calendar
        groups={[{ name: 'test', cost: 1000, currentPeople: 1, payday: 31 }]}
      />,
    );

    component.find('#next-button').simulate('click');
    component.find('#next-button').simulate('click');

    const wrapper = component.find('.cell');

    expect(wrapper.at(wrapper.length - 1).find('.payday').length).toBe(1);
  });

  it('should render payday on today', () => {
    const component = mount(
      <Calendar
        groups={[
          {
            name: 'test',
            cost: 1000,
            currentPeople: 1,
            payday: new Date().getDate(),
          },
        ]}
      />,
    );

    expect(component.find('.payday').hasClass('today')).toBe(true);
  });
});
