import cx from 'classnames';
import moment from 'moment-timezone';
import { Component } from 'react';
import Dropdown from 'app/components/Dropdown';
import Flex from 'app/components/Layout/Flex';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import parseDateValue from 'app/utils/parseDateValue';
import styles from './DatePicker.module.css';
import { createField } from './Field';
import TextInput from './TextInput';
import TimePicker from './TimePicker';

type Props = {
  onChange: (arg0: string) => void;
  className?: string;
  value: string | null | undefined;
  showTimePicker?: boolean;
  dateFormat?: string;
  name?: string;
};
type State = {
  pickerOpen: boolean;
  date: moment$Moment;
  value: moment$Moment;
};

class DatePicker extends Component<Props, State> {
  static defaultProps = {
    value: '',
    showTimePicker: true,
    dateFormat: 'lll',
  };
  static Field: any;
  state = {
    pickerOpen: false,
    date: moment(),
    value: parseDateValue(this.props.value),
  };
  onNext = () => {
    this.setState((prevState) => ({
      date: prevState.date.clone().add(1, 'month'),
    }));
  };
  onPrev = () => {
    this.setState((prevState) => ({
      date: prevState.date.clone().subtract(1, 'month'),
    }));
  };
  onChange = (day: moment$Moment) => {
    this.setState((prevState) => {
      const value = day
        .clone()
        .hour(prevState.value.hour())
        .minute(prevState.value.minute());
      return {
        value,
        pickerOpen: false,
      };
    }, this._notifyParent);
  };
  onChangeTime = (time: moment$Moment) => {
    this.setState((prevState) => {
      const value = prevState.value
        .clone()
        .hour(time.hour())
        .minute(time.minute());
      return {
        value,
      };
    }, this._notifyParent);
  };
  _notifyParent = () => this.props.onChange(this.state.value.toISOString());
  toggleDropdown = () => {
    this.setState((prevState) => ({
      pickerOpen: !prevState.pickerOpen,
    }));
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: parseDateValue(this.props.value),
      });
    }
  }

  render() {
    const { showTimePicker, className, name } = this.props;
    const { date } = this.state;
    return (
      <Dropdown
        show={this.state.pickerOpen}
        toggle={this.toggleDropdown}
        triggerComponent={
          <TextInput
            className={cx(styles.inputField, className)}
            value={this.state.value.format(this.props.dateFormat)}
            name={name}
            readOnly
          />
        }
        componentClass="div"
        contentClassName={styles.dropdown}
        style={{
          flex: 1,
        }}
      >
        <div className={styles.datePicker} onClick={(e) => e.stopPropagation()}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className={styles.header}
          >
            <button onClick={this.onPrev} className={styles.arrowIcon}>
              <i className="fa fa-long-arrow-left" />
            </button>
            <span>{date.format('MMMM YYYY')}</span>
            <button onClick={this.onNext} className={styles.arrowIcon}>
              <i className="fa fa-long-arrow-right" />
            </button>
          </Flex>

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
            <TimePicker
              value={this.state.value.toISOString()}
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
