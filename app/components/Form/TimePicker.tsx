import { Component } from 'react';
import parseDateValue from 'app/utils/parseDateValue';
import { createField } from './Field';
import TextInput from './TextInput';
import styles from './TimePicker.module.css';

function TimePickerInput({ onNext, onPrev, ...props }: any) {
  return (
    <div className={styles.timePickerInput}>
      <button type="button" onClick={onNext} className={styles.arrowIcon}>
        <i className="fa fa-angle-up" />
      </button>
      <TextInput {...props} />
      <button type="button" onClick={onPrev} className={styles.arrowIcon}>
        <i className="fa fa-angle-down" />
      </button>
    </div>
  );
}

type Props = {
  value: string;
  onChange: (arg0: any) => void;
};
type State = {
  value: moment$Moment;
  fieldValue: {
    hour: string;
    minute: string;
  };
};

class TimePicker extends Component<Props, State> {
  value = parseDateValue(this.props.value);
  state = {
    value: this.value,
    fieldValue: {
      hour: this.value.format('HH'),
      minute: this.value.format('mm'),
    },
  };
  static defaultProps = {
    value: '',
    fieldValue: {
      hour: '',
      minutes: '',
    },
  };
  static Field: any;
  onNext = (unit: string) => () => {
    this.setState((prevState) => {
      const value = prevState.value.clone().add(1, unit);
      return {
        value,
        fieldValue: {
          hour: value.format('HH'),
          minute: value.format('mm'),
        },
      };
    }, this.commit);
  };
  onNextHour = this.onNext('hour');
  onNextMinute = this.onNext('minute');
  onPrev = (unit: string) => () => {
    this.setState((prevState) => {
      const value = prevState.value.clone().subtract(1, unit);
      return {
        value,
        fieldValue: {
          hour: value.format('HH'),
          minute: value.format('mm'),
        },
      };
    }, this.commit);
  };
  onPrevHour = this.onPrev('hour');
  onPrevMinute = this.onPrev('minute');
  onChange =
    (unit: 'hour' | 'minute') =>
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (
        (unit === 'hour' && Number(value) < 24) ||
        (unit === 'minute' && Number(value) < 60)
      ) {
        this.setState(
          (prevState) => ({
            value: this.state.value.clone().set(unit, Number(value)),
            fieldValue: {
              hour: unit === 'hour' ? value : prevState.fieldValue.hour,
              minute: unit === 'minute' ? value : prevState.fieldValue.minute,
            },
          }),
          this.commit
        );
      }
    };
  onChangeHour = this.onChange('hour');
  onChangeMinute = this.onChange('minute');
  commit = () => this.props.onChange(this.state.value);

  render() {
    return (
      <div className={styles.timePicker}>
        <TimePickerInput
          onNext={this.onNextHour}
          onPrev={this.onPrevHour}
          value={this.state.fieldValue.hour}
          maxLength={2}
          onChange={this.onChangeHour}
          tabIndex={1}
        />
        {':'}
        <TimePickerInput
          onNext={this.onNextMinute}
          onPrev={this.onPrevMinute}
          value={this.state.fieldValue.minute}
          maxLength={2}
          onChange={this.onChangeMinute}
          tabIndex={2}
        />
      </div>
    );
  }
}

TimePicker.Field = createField(TimePicker);
export default TimePicker;
