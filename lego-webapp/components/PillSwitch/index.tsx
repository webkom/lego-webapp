import cx from 'classnames';
import styles from './PillSwitch.module.css';
import type { CSSProperties } from 'react';

export type PillSwitchOption<Value extends string> = {
  label: string;
  value: Value;
};

type Props<Value extends string> = {
  options: PillSwitchOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  ariaLabel: string;
  className?: string;
};

function PillSwitch<Value extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: Props<Value>) {
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );

  return (
    <div
      className={cx(styles.root, className)}
      role="group"
      aria-label={ariaLabel}
      style={
        {
          '--pill-switch-count': options.length,
          '--pill-switch-index': activeIndex,
        } as CSSProperties
      }
    >
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
}

export default PillSwitch;
