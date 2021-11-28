import React from 'react';
import { mount, shallow } from 'enzyme';
import RenderField from './RenderField';

describe('<RenderField />', () => {
  it('should render fields well', () => {
    const component = mount(
      <RenderField.WrappedComponent 
        container='test'
        category='test'
        content='test'
        section='test'
      />
    );
    expect(component.find('.test__test__field.test').length).toBe(1);
    expect(component.find('.category').length).toBe(1);
    expect(component.find('.content').length).toBe(1);
  });
  it('should render classnames well', () => {
    const component = mount(<RenderField.WrappedComponent />);
    expect(component.find('.__field').length).toBe(1);
    expect(component.find('.category').length).toBe(1);
    expect(component.find('.content').length).toBe(1);
  });
});
