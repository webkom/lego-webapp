import { useMemo } from 'react';
import Icon from 'app/components/Icon';
import parseDateValue from 'app/utils/parseDateValue';
import { createField } from './Field';
import TextInput from './TextInput';
import styles from './TimePicker.css';
import type { ComponentProps, SyntheticEvent } from 'react';

type TimePickerInputProps = ComponentProps<typeof TextInput> & {
  onNext: () => void;
  onPrev: () => void;
};

const TimePickerInput = ({
  onNext,
  onPrev,
  ...props
}: TimePickerInputProps) => (
  <div className={styles.timePickerInput}>
    <button type="button" onClick={onNext} className={styles.arrowIcon}>
      <Icon justifyContent="center" name="chevron-up-outline" />
    </button>
    <TextInput {...props} />
    <button type="button" onClick={onPrev} className={styles.arrowIcon}>
      <Icon justifyContent="center" name="chevron-down-outline" />
    </button>
  </div>
);

type Props = {
  value?: string;
  onChange: (newValue: string) => void;
};

const max = {
  hour: 23,
  minute: 59,
};

const TimePicker = ({ value, onChange }: Props) => {
  const parsedValue = useMemo(() => parseDateValue(value), [value]);

  const addOne = (unit: 'hour' | 'minute') => {
    const newValue = parsedValue.clone().add(1, unit);
    onChange(newValue.toISOString());
  };
  const subtractOne = (unit: 'hour' | 'minute') => {
    const newValue = parsedValue.clone().subtract(1, unit);
    onChange(newValue.toISOString());
  };

  const handleChange =
    (unit: 'hour' | 'minute') =>
    ({ currentTarget: { value } }: SyntheticEvent<HTMLInputElement>) => {
      if (Number(value) > max[unit] || Number(value) < 0) return;
      const newValue = parsedValue.clone().set(unit, Number(value));
      onChange(newValue.toISOString());
    };

  return (
    <div className={styles.timePicker}>
      <TimePickerInput
        onNext={() => addOne('hour')}
        onPrev={() => subtractOne('hour')}
        value={parsedValue.format('H')}
        maxLength={3}
        onChange={handleChange('hour')}
        tabIndex={1}
      />
      {':'}
      <TimePickerInput
        onNext={() => addOne('minute')}
        onPrev={() => subtractOne('minute')}
        value={parsedValue.format('mm')}
        maxLength={3}
        onChange={handleChange('minute')}
        tabIndex={2}
      />
    </div>
  );
};

TimePicker.Field = createField(TimePicker);
export default TimePicker;
