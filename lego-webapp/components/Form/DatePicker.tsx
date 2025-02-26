import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Calendar } from 'lucide-react';
import moment, { isMoment } from 'moment-timezone';
import { useState, useMemo } from 'react';
import Dropdown from '~/components/Dropdown';
import createMonthlyCalendar from '~/utils/createMonthlyCalendar';
import parseDateValue from '~/utils/parseDateValue';
import styles from './DatePicker.module.css';
import { createField } from './Field';
import TextInput from './TextInput';
import TimePicker from './TimePicker';
import type { Dateish } from 'app/models';
import type { Moment } from 'moment';

type BaseDatePickerProps = {
  className?: string;
  showTimePicker?: boolean;
  dateFormat?: string;
  name?: string;
  dropdownClassName?: string;
  onFocus: () => void;
};

type SingleDatePickerProps = BaseDatePickerProps & {
  range?: false;
  value?: Dateish;
  onChange: (selectedDate: Dateish) => void;
  onBlur: (selectedDate?: Dateish) => void;
};

type RangeDatePickerProps = BaseDatePickerProps & {
  range: true;
  value?: [Dateish, Dateish];
  onChange: (selectedDate: [Dateish, Dateish]) => void;
  onBlur: (selectedDate?: [Dateish, Dateish]) => void;
};

type Props = SingleDatePickerProps | RangeDatePickerProps;

const DatePicker = ({
  onChange,
  onFocus,
  onBlur,
  className,
  value,
  showTimePicker = true,
  dateFormat = 'lll',
  name,
  range = false,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const [date, setDate] = useState(() => {
    if (!range && !Array.isArray(value) && value) {
      return moment(value);
    }
    return moment();
  });

  const [startDate, setstartDate] = useState(() => {
    if (range && Array.isArray(value) && value[0]) {
      return moment(value[0]);
    }
    return moment();
  });
  const [endDate, setendDate] = useState(() => {
    if (range && Array.isArray(value) && value[1]) {
      return moment(value[1]);
    }
    if (range && Array.isArray(value) && value[0]) {
      return moment(value[0]).add(1, 'month');
    }
    return moment().add(1, 'month');
  });

  const parsedValue = useMemo(() => {
    if (range && Array.isArray(value)) {
      return value.map((v) => (v ? parseDateValue(v) : ''));
    }
    return value ? parseDateValue(value as string) : '';
  }, [value, range]);

  const onNext = () => {
    if (range) {
      setstartDate(startDate.clone().add(1, 'month'));
      setendDate(endDate.clone().add(1, 'month'));
    } else {
      setDate(date.clone().add(1, 'month'));
    }
  };

  const onPrev = () => {
    if (range) {
      setstartDate(startDate.clone().subtract(1, 'month'));
      setendDate(endDate.clone().subtract(1, 'month'));
    } else {
      setDate(date.clone().subtract(1, 'month'));
    }
  };

  const togglePicker = (open = !pickerOpen) => {
    setPickerOpen(open);
    if (open) {
      onFocus();
    } else {
      handleBlur(value);
    }
  };

  const handleChange = (newValue: Dateish | [Dateish, Dateish]) => {
    if (range) {
      (onChange as RangeDatePickerProps['onChange'])(
        newValue as [Dateish, Dateish],
      );
    } else {
      (onChange as SingleDatePickerProps['onChange'])(newValue as Dateish);
    }
  };

  const handleBlur = (blurValue?: Dateish | [Dateish, Dateish]) => {
    if (range) {
      (onBlur as RangeDatePickerProps['onBlur'])(
        blurValue as [Dateish, Dateish],
      );
    } else {
      (onBlur as SingleDatePickerProps['onBlur'])(blurValue as Dateish);
    }
  };

  const changeDay = (day: Moment) => {
    // Single date picker
    if (!range && isMoment(parsedValue)) {
      const value = day
        .clone()
        .hour(parsedValue.hour())
        .minute(parsedValue.minute());
      handleChange(value.toISOString());
      handleBlur(value.toISOString());
      if (!showTimePicker) {
        setPickerOpen(false);
      }
      return;
    }

    // Range date picker
    const selected = day.clone();
    const createDateWithTime = (date: Moment, isEndDate = false) => {
      return date
        .clone()
        .hour(showTimePicker ? (isEndDate ? 23 : 0) : date.hour())
        .minute(showTimePicker ? (isEndDate ? 59 : 0) : date.minute())
        .toISOString();
    };

    // Case 1: Initial selection or no start date
    if (!Array.isArray(value) || !value[0]) {
      handleChange([createDateWithTime(selected), '']);
      return;
    }

    const startDate = moment(value[0]);
    const endDate = value[1] ? moment(value[1]) : null;

    // Case 2: We have a start date but no end date
    if (!endDate) {
      // If selected date is before start, make it the new start
      if (selected.isBefore(startDate)) {
        handleChange([createDateWithTime(selected), '']);
        return;
      }
      // Otherwise set it as end date
      handleChange([value[0], createDateWithTime(selected, true)]);
      if (!showTimePicker) {
        setPickerOpen(false);
      }
      return;
    }

    // Case 3: We have both dates
    const isClickingStartDate = selected.isSame(startDate, 'day');
    const isClickingEndDate = selected.isSame(endDate, 'day');

    if (isClickingStartDate) {
      // Clear both dates when clicking start date
      handleChange(['', '']);
    } else if (isClickingEndDate) {
      // Remove end date if clicking end date with both dates selected, and set start date to end date
      handleChange([createDateWithTime(selected), '']);
    } else {
      if (selected.isAfter(endDate)) {
        // If after current end date, keep start date and set new end date
        handleChange([value[0], createDateWithTime(selected, true)]);
      } else if (selected.isBefore(startDate)) {
        // If before current start date, make it the new start date
        handleChange([createDateWithTime(selected), value[1]]);
      } else {
        // If between start and end, update start date
        handleChange([createDateWithTime(selected), value[1]]);
      }
    }
  };

  const isInRange = (day: Moment) => {
    if (!range || !Array.isArray(value)) return false;
    const [start, end] = value.map((d) => moment(d));
    return day.isBetween(start, end, 'day', '[]');
  };

  const displayValue = useMemo(() => {
    if (!range && isMoment(parsedValue) && !Array.isArray(parsedValue)) {
      return parsedValue.format(showTimePicker ? dateFormat : 'LL');
    }

    if (!Array.isArray(value)) return '';
    const format = showTimePicker ? dateFormat : 'LL';

    const start = value[0] ? moment(value[0]).format(format) : '';
    const end = value[1] ? moment(value[1]).format(format) : '';

    if (!start && !end) return '';
    if (!end) return `${start} - ...`;
    if (!start) return `... - ${end}`;

    return `${start} - ${end}`;
  }, [value, dateFormat, showTimePicker, range, parsedValue]);

  const renderCalendar = (currentDate: Moment) => (
    <table className={styles.calendar}>
      <thead>
        <tr>
          {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map((d, i) => (
            <th key={i}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(
          { length: Math.ceil(createMonthlyCalendar(currentDate).length / 7) },
          (_, i) => (
            <tr key={i}>
              {createMonthlyCalendar(currentDate)
                .slice(i * 7, i * 7 + 7)
                .map((dateProps, j) => (
                  <td key={j}>
                    <button
                      className={cx(
                        styles.calendarItem,
                        dateProps.prevOrNextMonth && styles.prevOrNextMonth,
                        !range &&
                          !Array.isArray(parsedValue) &&
                          dateProps.day.isSame(parsedValue, 'day') &&
                          styles.selectedDate,
                        range &&
                          dateProps.day.isSame(parsedValue?.[0], 'day') &&
                          styles.selectedDate,
                        range &&
                          dateProps.day.isSame(parsedValue?.[1], 'day') &&
                          styles.selectedDate,
                        dateProps.day.isSame(moment(), 'day') && styles.today,
                        isInRange(dateProps.day) && styles.inRange,
                      )}
                      onClick={() => changeDay(dateProps.day)}
                    >
                      {dateProps.day.date()}
                    </button>
                  </td>
                ))}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );

  return (
    <Dropdown
      show={pickerOpen}
      toggle={() => togglePicker()}
      triggerComponent={
        <TextInput
          className={cx(styles.inputField, className)}
          prefixIconNode={<Calendar />}
          value={displayValue}
          name={name}
          readOnly
        />
      }
      componentClass="div"
      contentClassName={cx(styles.dropdown, range && styles.rangeDropdown)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className={styles.header}
        >
          <Icon onPress={onPrev} name="arrow-back-outline" />
          <span>
            {range
              ? `${startDate.format('MMMM YYYY')} - ${
                  startDate.isSame(endDate, 'day')
                    ? startDate.clone().add(1, 'month').format('MMMM YYYY')
                    : endDate.format('MMMM YYYY')
                }`
              : date.format('MMMM YYYY')}
          </span>
          <Icon onPress={onNext} name="arrow-forward-outline" />
        </Flex>

        {range ? (
          <Flex wrap justifyContent="center" gap="var(--spacing-md)">
            {renderCalendar(startDate)}
            {renderCalendar(
              startDate.isSame(endDate, 'day')
                ? startDate.clone().add(1, 'month')
                : endDate,
            )}
          </Flex>
        ) : (
          renderCalendar(date)
        )}

        {showTimePicker && (
          <>
            {range ? (
              <Flex justifyContent="space-around">
                <div>
                  <TimePicker
                    value={Array.isArray(value) ? value[0] : undefined}
                    onChange={(newTime) => {
                      if (!Array.isArray(value)) return;
                      handleChange([newTime, value[1]]);
                    }}
                  />
                </div>
                <div>
                  <TimePicker
                    value={Array.isArray(value) ? value[1] : undefined}
                    onChange={(newTime) => {
                      if (!Array.isArray(value)) return;
                      handleChange([value[0], newTime]);
                    }}
                  />
                </div>
              </Flex>
            ) : (
              <TimePicker value={value as string} onChange={handleChange} />
            )}
          </>
        )}
      </div>
    </Dropdown>
  );
};

DatePicker.Field = createField(DatePicker);
export default DatePicker;
