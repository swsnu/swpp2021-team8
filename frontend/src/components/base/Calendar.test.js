// import React from 'react';
// import { mount, shallow } from 'enzyme';
// import Calendar from './Calendar';

// describe('<Calendar />', () => {
//   it('should render without error when user goes to my page ', () => {
//     const component = shallow(<Calendar />);
//     expect(component.find('.calendar').length).toBe(1);
//   });
//   it('should not change year when user clicks prev button when not on Jan', () => {
//     const stubYearState = 2021;
//     const stubMonthState = 11;
//     React.useState = jest.fn()
//         .mockReturnValueOnce([stubYearState, {}])
//         .mockReturnValueOnce([stubMonthState, {}]);
//     const component = mount(<Calendar />);
//     const wrapper = component.find('#previous-button');
//     wrapper.simulate('click');
//     });
// });
