import React from 'react';
import { withRouter } from 'react-router';
import './FieldInfoItem.scss';

const FieldInfoItem = ({ container = '', category = '', content = '', section = '' }) => {
  const classname = container.concat(
    section ? '__'.concat(section) : '',
    '__field',
    ' '.concat(category.toLowerCase()),
  );
  return (
    <div className={classname}>
      <div className={category.toLowerCase().concat(' category')}>
        {category}
      </div>
      <div className={category.toLowerCase().concat(' content')}>
        {content}
      </div>
    </div>
  );
};
export default withRouter(FieldInfoItem);
