import styles from './ProgressBar.module.css';

type Props = {
  value: number;
  max: number;
  label: string;
};

export const progressPercent = (value: number, max: number) =>
  max > 0 ? Math.min((value / max) * 100, 100) : 0;

const ProgressBar = ({ value, max, label }: Props) => {
  const percent = progressPercent(value, max);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={styles.track}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
};

export default ProgressBar;
