import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { createField } from './Field';
import { LabelText } from './Label';
import styles from './Slider.module.css';
import type { CSSProperties, ReactNode } from 'react';

export type SliderOption = {
  value: string;
  label: string;
};

type Props = {
  options: SliderOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: ReactNode;
  required?: boolean;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

/* Picks one of a small, ordered set of options along a native range input;
   the dots, fill and tick labels are decoration underneath it. */
const Slider = ({
  options,
  value,
  onChange,
  label,
  required,
  placeholder,
  id,
  disabled,
  className,
  ...props
}: Props) => {
  const index = options.findIndex((option) => option.value === value);
  const lastIndex = Math.max(options.length - 1, 1);
  const selected = index >= 0;
  const progress = selected ? index / lastIndex : 0;

  return (
    <div
      className={cx(styles.slider, !selected && styles.unset, className)}
      style={{ '--slider-progress': progress } as CSSProperties}
    >
      <Flex
        alignItems="baseline"
        justifyContent="space-between"
        gap="var(--spacing-sm)"
      >
        <label htmlFor={id}>
          <LabelText label={label} required={required} />
        </label>
        <span className={styles.value}>
          {selected ? options[index].label : placeholder}
        </span>
      </Flex>

      <div className={styles.track}>
        <span className={styles.line} />
        <span className={styles.fill} />

        {options.map((option, stop) => (
          <span
            key={option.value}
            className={cx(
              styles.dot,
              selected && stop <= index && styles.dotOn,
            )}
            style={{ '--slider-stop': stop / lastIndex } as CSSProperties}
          />
        ))}

        {options.map((option, stop) => (
          <span
            key={option.value}
            className={cx(styles.tick, stop === index && styles.tickOn)}
            style={{ '--slider-stop': stop / lastIndex } as CSSProperties}
          >
            {option.label}
          </span>
        ))}

        {selected && <span className={styles.thumb} />}

        <input
          {...props}
          id={id}
          type="range"
          className={styles.input}
          min={0}
          max={lastIndex}
          step={1}
          disabled={disabled}
          value={selected ? index : 0}
          aria-valuetext={selected ? options[index].label : placeholder}
          onChange={(event) =>
            onChange?.(options[Number(event.target.value)].value)
          }
        />
      </div>
    </div>
  );
};

Slider.Field = createField(Slider, { ownLabel: true });
export default Slider;
