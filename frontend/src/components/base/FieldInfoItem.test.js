import React from 'react';
import { mount } from 'enzyme';
import FieldInfoItem from './FieldInfoItem';

describe('<FieldInfoItem />', () => {
  it('should render fields well', () => {
    const component = mount(
      <FieldInfoItem.WrappedComponent
        container="test"
        category="test"
        content="test"
        section="test"
      />,
    );
    expect(component.find('.test__test__field.test').length).toBe(1);
    expect(component.find('.category').length).toBe(1);
    expect(component.find('.content').length).toBe(1);
  });
  it('should render classnames well', () => {
    const component = mount(<FieldInfoItem.WrappedComponent />);
    expect(component.find('.__field').length).toBe(1);
    expect(component.find('.category').length).toBe(1);
    expect(component.find('.content').length).toBe(1);
  });
});
