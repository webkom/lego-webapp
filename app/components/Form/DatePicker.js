// @flow

import React, { Component } from 'react';
import moment from 'moment';
import cx from 'classnames';
import TextInput from 'app/components/Form/TextInput';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import { createField } from './Field';
import TimePicker from './TimePicker';
import styles from './DatePicker.css';

type Props = {
  onChange: () => void
};

// TODO THIS THING IS IN PROGRESS AND VERY BROKEN ATM.
// DEPLOY IT TO PROD AND EVERY USER IN THE WORLD WILL HATE YOU AND YOU WILL BE FIRED.
class DatePicker extends Component {
  static defaultProps = {
    value: '',
    showTimePicker: true,
    format: 'lll'
  };

  static Field: any;

  state = {
    pickerOpen: false,
    value: this.props.value ? moment(this.props.value) : moment(),
    date: moment(this.props.date)
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value) {
      this.setState({ value: moment(nextProps.value) });
    }
  }

  onNext = () => {
    this.setState((prevState) => ({
      date: prevState.date.clone().add(1, 'month')
    }));
  };

  onPrev = () => {
    this.setState((prevState) => ({
      date: prevState.date.clone().subtract(1, 'month')
    }));
  };

  onChange = (value: moment) => {
    this.setState({
      value,
      pickerOpen: false
    }, () => this.props.onChange(value.toString()));
  };

  onChangeTime = () => {

  };

  render() {
    const { showTimePicker } = this.props;
    const { date } = this.state;

    return (
      <Dropdown
        show={this.state.pickerOpen}
        toggle={() => this.setState((prevState) => ({ pickerOpen: !prevState.pickerOpen }))}
        triggerComponent={(
          <span>{this.state.value.format(this.props.format)}</span>
        )}
        componentClass='div'
        contentClassName={styles.dropdown}
      >
        <div className={styles.datePicker}>
          <div className={styles.header}>
            <button onClick={this.onPrev}><Icon name='angle-left' /></button>
            <h3>{date.format('MMMM YYYY')}</h3>
            <button onClick={this.onNext}><Icon name='angle-right' /></button>
          </div>

          <div className={styles.calendar}>
            {createMonthlyCalendar(date).map((dateProps, i) => (
              <button
                key={i}
                className={cx(
                  styles.calendarItem,
                  dateProps.prevOrNextMonth && styles.prevOrNextMonth,
                  dateProps.day.isSame(this.state.value) && styles.selectedDate
                )}
                onClick={() => this.onChange(dateProps.day)}
                disabled={dateProps.prevOrNextMonth}
              >
                {dateProps.day.date()}
              </button>
            ))}
          </div>

          {showTimePicker && (
            <TimePicker
              value={date}
              onChange={this.onChangeTime}
            />
          )}
        </div>
      </Dropdown>
    );
  }
}

DatePicker.Field = createField(DatePicker);

export default DatePicker;
