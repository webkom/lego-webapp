// @flow

import React, { Component } from 'react';
import moment from 'moment';
import cx from 'classnames';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import { createField } from './Field';
import TextInput from './TextInput';
import TimePicker from './TimePicker';
import styles from './DatePicker.css';

type Props = {
  onChange: () => void,
  className?: string,
  value: ?string,
  showTimePicker?: boolean,
  dateFormat?: string
};

function parseDateValue(value) {
  if (value) return moment(value);
  return moment();
}

class DatePicker extends Component {
  props: Props;

  static defaultProps = {
    value: '',
    showTimePicker: true,
    dateFormat: 'lll'
  };

  static Field: any;

  state = {
    pickerOpen: false,
    date: moment(),
    value: parseDateValue(this.props.value)
  };

  onNext = () => {
    this.setState(prevState => ({
      date: prevState.date.clone().add(1, 'month')
    }));
  };

  onPrev = () => {
    this.setState(prevState => ({
      date: prevState.date.clone().subtract(1, 'month')
    }));
  };

  onChange = (day: moment) => {
    this.setState(prevState => {
      const value = day
        .clone()
        .hour(prevState.value.hour())
        .minute(prevState.value.minute());

      return {
        value,
        pickerOpen: false
      };
    }, this._notifyParent);
  };

  onChangeTime = (time: moment) => {
    this.setState(prevState => {
      const value = prevState.value
        .clone()
        .hour(time.hour())
        .minute(time.minute());

      return {
        value
      };
    }, this._notifyParent);
  };

  _notifyParent = () => this.props.onChange(this.state.value.toString());

  toggleDropdown = () => {
    this.setState(prevState => ({
      pickerOpen: !prevState.pickerOpen
    }));
  };

  render() {
    const { showTimePicker, className } = this.props;
    const { date } = this.state;

    return (
      <Dropdown
        show={this.state.pickerOpen}
        toggle={this.toggleDropdown}
        triggerComponent={
          <TextInput
            className={cx(styles.inputField, className)}
            disabled
            value={this.state.value.format(this.props.dateFormat)}
          />
        }
        componentClass="div"
        contentClassName={styles.dropdown}
        style={{ flex: 1 }}
      >
        <div className={styles.datePicker}>
          <div className={styles.header}>
            <button onClick={this.onPrev}>
              <Icon name="arrow-back" />
            </button>
            <h3>{date.format('MMMM YYYY')}</h3>
            <button onClick={this.onNext}>
              <Icon name="arrow-forward" />
            </button>
          </div>

          <div className={styles.calendar}>
            {createMonthlyCalendar(date).map((dateProps, i) => (
              <button
                key={i}
                className={cx(
                  styles.calendarItem,
                  dateProps.prevOrNextMonth && styles.prevOrNextMonth,
                  dateProps.day.isSame(this.state.value, 'day') &&
                    styles.selectedDate
                )}
                onClick={() => this.onChange(dateProps.day)}
                disabled={dateProps.prevOrNextMonth}
              >
                {dateProps.day.date()}
              </button>
            ))}
          </div>

          {showTimePicker && (
            <TimePicker value={this.state.value} onChange={this.onChangeTime} />
          )}
        </div>
      </Dropdown>
    );
  }
}

DatePicker.Field = createField(DatePicker);

export default DatePicker;
