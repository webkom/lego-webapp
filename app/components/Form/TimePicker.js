// @flow

import React, { Component } from 'react';
import moment from 'moment-timezone';
import Icon from 'app/components/Icon';
import TextInput from './TextInput';
import { createField } from './Field';
import styles from './TimePicker.css';

function TimePickerInput({ onNext, onPrev, ...props }: any) {
  return (
    <div className={styles.timePickerInput}>
      <button type="button" onClick={onNext}>
        <Icon name="arrow-up" />
      </button>
      <TextInput {...props} />
      <button type="button" onClick={onPrev}>
        <Icon name="arrow-down" />
      </button>
    </div>
  );
}

type Props = {
  value: string,
  onChange: any => void
};

function parseValue(value) {
  return value ? moment(value) : moment();
}

// @Todo: prettify
class TimePicker extends Component {
  props: Props;

  static defaultProps = {
    value: ''
  };

  static Field: any;

  state = {
    value: parseValue(this.props.value)
  };

  onNext = (unit: string) => () => {
    this.setState(
      prevState => ({
        value: prevState.value.clone().add(1, unit)
      }),
      this.commit
    );
  };

  onNextHour = this.onNext('hour');
  onNextMinute = this.onNext('minute');

  onPrev = (unit: string) => () => {
    this.setState(
      prevState => ({
        value: prevState.value.clone().subtract(1, unit)
      }),
      this.commit
    );
  };

  onPrevHour = this.onPrev('hour');
  onPrevMinute = this.onPrev('minute');

  onChange = (unit: 'hour' | 'minute') => () => {
    this.setState(
      {
        // $FlowFixMe
        value: this.state.value.clone()[unit].call(null, 1)
      },
      this.commit
    );
  };

  commit = () => this.props.onChange(this.state.value);

  render() {
    return (
      <div className={styles.timePicker}>
        <TimePickerInput
          onNext={this.onNextHour}
          onPrev={this.onPrevHour}
          value={this.state.value.format('HH')}
          onChange={this.onChange}
          tabIndex={1}
        />
        {':'}
        <TimePickerInput
          onNext={this.onNextMinute}
          onPrev={this.onPrevMinute}
          value={this.state.value.format('mm')}
          tabIndex={2}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

TimePicker.Field = createField(TimePicker);
export default TimePicker;
