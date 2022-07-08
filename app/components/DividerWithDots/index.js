//@flow

import cx from 'classnames';

import styles from './DividerWithDots.css';

type Props = {
  extraStyle?: Object,
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
