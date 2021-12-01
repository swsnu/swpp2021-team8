import React from 'react';
import { shallow } from 'enzyme';
import GroupListItem from './GroupListItem';
import { history } from '../../test-utils/mock';

describe('<GroupListItem />', () => {
  it('should render without error', () => {
    const mockGroup = { currentPeople: 1, maxPeople: 4 };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} />,
    );

    expect(component.find('.group-item').length).toBe(1);
  });

  it('should contain correct linearGradient when vacantPercent is 0', () => {
    const mockGroup = { currentPeople: 4, maxPeople: 4 };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} />,
    );

    expect(JSON.stringify(component.find('.group-item').props().style)).toMatch(
      'linear-gradient(to right, #C99208 0%, #CD3131 0%)',
    );
  });

  it('should contain correct linearGradient when vacantPercent is 100', () => {
    const mockGroup = { currentPeople: 0, maxPeople: 4 };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} />,
    );

    expect(JSON.stringify(component.find('.group-item').props().style)).toMatch(
      'linear-gradient(to right, #C99208 100%, #CD3131 0%)',
    );
  });

  it('should go to group detail page when clicks group Item', () => {
    const mockGroup = { id: 1, currentPeople: 1, maxPeople: 4 };
    history.push = jest.fn(() => {});
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} history={history} />,
    );

    component.find('.group-item').simulate('click');

    expect(history.push).toHaveBeenCalledWith('/group/1');
  });
});
