import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import moment from 'moment-timezone';
import { useState } from 'react';
import Dropdown from 'app/components/Dropdown';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import parseDateValue from 'app/utils/parseDateValue';
import styles from './DatePicker.css';
import { createField } from './Field';
import TextInput from './TextInput';
import TimePicker from './TimePicker';
import type { Moment } from 'moment';

type Props = {
  onChange: (selectedDate: string) => void;
  onBlur: (selectedDate?: string) => void;
  onFocus: () => void;
  className?: string;
  value?: string;
  showTimePicker?: boolean;
  dateFormat?: string;
  name?: string;
};

const DatePicker = ({
  onChange,
  onFocus,
  onBlur,
  className,
  value,
  showTimePicker = true,
  dateFormat = 'lll',
  name,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [date, setDate] = useState(moment());
  const parsedValue = parseDateValue(value);

  const onNext = () => setDate(date.clone().add(1, 'month'));
  const onPrev = () => setDate(date.clone().subtract(1, 'month'));

  const togglePicker = (open = !pickerOpen) => {
    setPickerOpen(open);
    open ? onFocus() : onBlur(value);
  };

  const changeDay = (day: Moment) => {
    const value = day
      .clone()
      .hour(parsedValue.hour())
      .minute(parsedValue.minute());
    onChange(value.toISOString());
    onBlur(value.toISOString());
    setPickerOpen(false);
  };

  return (
    <Dropdown
      show={pickerOpen}
      toggle={() => togglePicker()}
      triggerComponent={
        <TextInput
          className={cx(styles.inputField, className)}
          value={parsedValue.format(dateFormat)}
          name={name}
          readOnly
        />
      }
      componentClass="div"
      contentClassName={styles.dropdown}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className={styles.header}
        >
          <button onClick={onPrev} className={styles.arrowIcon}>
            <Icon name="arrow-back-outline" />
          </button>
          <span>{date.format('MMMM YYYY')}</span>
          <button onClick={onNext} className={styles.arrowIcon}>
            <Icon name="arrow-forward-outline" />
          </button>
        </Flex>

        <div className={styles.calendar}>
          {createMonthlyCalendar(date).map((dateProps, i) => (
            <button
              key={i}
              className={cx(
                styles.calendarItem,
                dateProps.prevOrNextMonth && styles.prevOrNextMonth,
                dateProps.day.isSame(parsedValue, 'day') && styles.selectedDate
              )}
              onClick={() => changeDay(dateProps.day)}
              disabled={dateProps.prevOrNextMonth}
            >
              {dateProps.day.date()}
            </button>
          ))}
        </div>

        {showTimePicker && <TimePicker value={value} onChange={onChange} />}
      </div>
    </Dropdown>
  );
};

DatePicker.Field = createField(DatePicker);
export default DatePicker;
