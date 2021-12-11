import React from 'react';
import { shallow } from 'enzyme';
import GroupListItem from './GroupListItem';
import { history } from '../../test-utils/mock';

const mockGroup = {
  id: 1,
  currentPeople: 1,
  maxPeople: 4,
  platform: 'netflix',
};

describe('<GroupListItem />', () => {
  it('should render without error', () => {
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} />,
    );

    expect(component.find('.group-item').length).toBe(1);
  });

  it('should contain correct linearGradient when vacantPercent is 0', () => {
    const mockGroupFull = {
      currentPeople: 4,
      maxPeople: 4,
      platform: 'netflix',
    };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroupFull} />,
    );

    expect(JSON.stringify(component.find('.group-item').props().style)).toMatch(
      'linear-gradient(to right, #C99208 0%, #CD3131 0%)',
    );
  });

  it('should contain correct linearGradient when vacantPercent is 100', () => {
    const mockGroupEmpty = {
      currentPeople: 0,
      maxPeople: 4,
      platform: 'netflix',
    };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroupEmpty} />,
    );

    expect(JSON.stringify(component.find('.group-item').props().style)).toMatch(
      'linear-gradient(to right, #C99208 100%, #CD3131 0%)',
    );
  });

  it('should go to group detail page when clicks group Item', () => {
    history.push = jest.fn(() => {});
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroup} history={history} />,
    );

    component.find('.group-item').simulate('click');

    expect(history.push).toHaveBeenCalledWith('/group/1');
  });

  it('should render only title when only Title option is true', () => {
    history.push = jest.fn(() => {});
    const component = shallow(
      <GroupListItem.WrappedComponent
        group={mockGroup}
        history={history}
        onlyTitle
      />,
    );

    expect(component.find('.group-item__membership').length).toBe(0);
  });

  it('should not render image if group platform is null', () => {
    const mockGroupNoPlatform = {
      id: 1,
      currentPeople: 1,
      maxPeople: 4,
      platform: null,
    };
    const component = shallow(
      <GroupListItem.WrappedComponent group={mockGroupNoPlatform} />,
    );
    expect(component.find('img').length).toBe(0);
  });
});
