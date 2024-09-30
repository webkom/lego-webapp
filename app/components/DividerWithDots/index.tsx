import cx from 'classnames';
import styles from './DividerWithDots.module.css';

type Props = {
  extraStyle?: Record<string, any>;
};

const DividerWithDots = ({ extraStyle }: Props) => {
  return (
    <div className={styles.visionLine} style={extraStyle}>
      <span className={styles.dot} />
      <span className={cx(styles.dot, styles.dotBottom)} />
    </div>
  );
};

export default DividerWithDots;
