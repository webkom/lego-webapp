import cx from 'classnames';
import styles from './PillSwitch.module.css';
import type { CSSProperties } from 'react';

export type PillSwitchOption = {
  label: string;
  value: string;
};

type Props = {
  options: PillSwitchOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

const PillSwitch = ({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: Props) => {
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const indicatorStyle: CSSProperties = {
    width: `${100 / options.length}%`,
    transform: `translateX(${activeIndex * 100}%)`,
  };

  return (
    <div className={cx(styles.root, className)} role="group" aria-label={ariaLabel}>
      <span className={styles.indicator} style={indicatorStyle} />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.button}
          data-active={value === option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PillSwitch;
