import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';

import './Calendar.scss';

const CALENDAR_TABLE_HEADER = (
  <Table.Header classname="calendar__table__header">
    <Table.Row>
      <Table.HeaderCell className="sunday">Sun</Table.HeaderCell>
      <Table.HeaderCell>Mon</Table.HeaderCell>
      <Table.HeaderCell>Tue</Table.HeaderCell>
      <Table.HeaderCell>Wed</Table.HeaderCell>
      <Table.HeaderCell>Thu</Table.HeaderCell>
      <Table.HeaderCell>Fri</Table.HeaderCell>
      <Table.HeaderCell>Sat</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);
const CalendarTableBody = (year, month) => {
  const dates = [];
  const maxDate = (new Date(year, month + 1, 0)).getDate();
  const today = new Date();
  for (let date = 1; date <= maxDate; date += 1) {
    dates.push(new Date(year, month, date));
  }
  let i = 0;
  const rows = [];
  for (let week = 0; week < 5; week += 1) {
    const row = [];
    for (let day = 0; day < 7; day += 1) {
      const date = dates[i];
      if (date !== undefined && day === date.getDay()) {
        if (date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate()) {
          row.push(
            <Table.Cell className={`cell ${day === 0 && 'sunday'} today`} key={7 * week + day}>
              <div className="date">{date.getDate()}</div>
            </Table.Cell>,
          );
        } else {
          row.push(
            <Table.Cell className={`cell ${day === 0 && 'sunday'}`} key={7 * week + day}>
              <div className="date">{date.getDate()}</div>
            </Table.Cell>,
          );
        }
        i += 1;
      } else {
        row.push(<Table.Cell key={7 * week + day}> </Table.Cell>);
      }
    }
    rows.push(row);
  }
  return (
    <Table.Body className="calendar__table__body">
      {rows.map((row) => (<Table.Row>{row}</Table.Row>))}
    </Table.Body>
  );
};
const Calendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const onPreviousClick = () => {
    setYear(month === 1 ? year - 1 : year);
    setMonth(month === 1 ? 12 : month - 1);
  };
  const onNextClick = () => {
    setYear(month === 12 ? year + 1 : year);
    setMonth(month === 12 ? 1 : month + 1);
  };
  return (
    <div className="calendar">
      <div className="calendar__header">
        {year}
        .
        {month}
      </div>
      <div className="calendar__body">
        <button id="previous-button" onClick={onPreviousClick} type="button">
          &lt;
        </button>
        <Table striped className="calendar__table">
          {CALENDAR_TABLE_HEADER}
          {CalendarTableBody(year, month - 1)}
        </Table>
        <button id="next-button" onClick={onNextClick} type="button">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Calendar;
