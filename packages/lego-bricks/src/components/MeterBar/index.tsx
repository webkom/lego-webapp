import cx from 'classnames';
import styles from './MeterBar.module.css';

type Props = {
  labels: (string | number)[];
  progress: number;
  labelColor: string;
  barColor: string;
  separatorColor: string;
};

export const MeterBar = ({
  labels,
  progress,
  labelColor,
  barColor,
  separatorColor,
}: Props) => {
  const style = {
    width: `${progress}%`,
    backgroundColor: barColor,
  };

  return (
    <div className={styles.progressBar}>
      <div className={styles.labelHolder}>
        <BarLabels labels={labels} color={labelColor} />
      </div>
      <div className={styles.progressBg}>
        <div className={styles.progress} style={style} />
        <BarSegments labels={labels} color={separatorColor} />
      </div>
    </div>
  );
};

type LabelsProps = {
  labels: (string | number)[];
  color: string;
};
const BarLabels = ({ labels, color }: LabelsProps) => {
  const dist = 100 / (labels.length - 1);
  const style = { color };
  return (
    <>
      {labels.map((label, i) => (
        <span
          style={{ left: `${dist * i}%`, ...style }}
          className={styles.label}
          key={label}
        >
          {label}
        </span>
      ))}
    </>
  );
};

type SegmentsProps = {
  labels: (string | number)[];
  color: string;
};
const BarSegments = ({ labels, color }: SegmentsProps) => {
  const dist = 100 / (labels.length - 1);
  return (
    <>
      {labels.map((label, i) =>
        i === 0 || i === labels.length - 1 ? null : (
          <div
            style={{
              left: `${dist * i}%`,
              backgroundColor: color,
            }}
            className={cx(styles.label, styles.separator)}
            key={label}
          />
        ),
      )}
    </>
  );
};
