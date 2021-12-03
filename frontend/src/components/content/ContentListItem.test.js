import React from 'react';
import { shallow } from 'enzyme';
import ContentListItem from './ContentListItem';
import { history } from '../../test-utils/mock';

describe('<ContentListItem />', () => {
  it('should render without error', () => {
    const mockContent = { id: 1 };
    const component = shallow(
      <ContentListItem.WrappedComponent content={mockContent} />,
    );

    expect(component.find('img').length).toBe(1);
  });

  it('should move to ContentDetailPage when clicks content', () => {
    const mockContent = { id: 1 };
    history.push = jest.fn(() => {});
    const component = shallow(
      <ContentListItem.WrappedComponent
        content={mockContent}
        history={history}
      />,
    );

    component.find('div').simulate('click');

    expect(history.push).toHaveBeenCalledWith('/content/1');
  });

  it('should not move to ContentDetailPage when clicks content if content id is 0', () => {
    const mockContent = { id: 0 };
    history.push = jest.fn(() => {});
    const component = shallow(
      <ContentListItem.WrappedComponent
        content={mockContent}
        history={history}
      />,
    );

    component.find('div').simulate('click');

    expect(history.push).toHaveBeenCalledTimes(0);
  });
});
