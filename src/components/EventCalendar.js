import '../styles/Calendar.css';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import range from 'lodash/utility/range';
import takeWhile from 'lodash/array/takeWhile';
import last from 'lodash/array/last';

export default class EventCalendar extends Component {

  static propTypes = {
    weekOffset: PropTypes.number
  }

  static defaultProps = {
    weekOffset: 0
  }

  state = {
    date: moment()
  }

  days() {
    const date = this.state.date.startOf('month');

    let diff = date.weekday() - this.props.weekOffset;
    if (diff < 0) diff += 7;

    const prevMonthDays = range(0, diff).map(n => ({
      day: date.clone().subtract(diff - n, 'days'),
      classNames: 'prev-month'
    }));

    const currentMonthDays = range(1, this.state.date.daysInMonth() + 1).map(index => ({
      day: moment([this.state.date.year(), this.state.date.month(), index])
    }));

    const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
    const nextMonthDays = takeWhile(range(1, 7), n => (daysAdded - n) % 7 !== 0).map((n) => ({
      day: last(currentMonthDays).day.clone().add(n, 'days'),
      classNames: 'next-month'
    }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  _onNext() {
    this.setState({ date: this.state.date.add(1, 'months') });
  }

  _onPrev() {
    this.setState({ date: this.state.date.subtract(1, 'months') });
  }

  render() {
    return (
      <div className='Calendar u-container'>
        <h2>
          <span onClick={::this._onPrev}>&laquo;</span>
          <span>{this.state.date.format('MMMM YYYY')}</span>
          <span onClick={::this._onNext}>&raquo;</span>
        </h2>
        <div className='Calendar-grid'>
          {this.days().map((day, i) =>
            <div key={`day-${i}`} className={'Calendar-grid-item ' + day.classNames}>
              <span className='day-number'>{day.day.format('YYYY-MM-D')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
