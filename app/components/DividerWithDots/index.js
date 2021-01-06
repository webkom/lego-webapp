//@flow

import styles from './DividerWithDots.css';
import cx from 'classnames';

type Props = {
  extraStyle?: Object,
};

const DividerWithDots = ({ extraStyle }: Props) => {
  return (
    <div className={styles.vision__line} style={extraStyle}>
      <span className={styles.dot} />
      <span className={cx(styles.dot, styles.dotBottom)} />
    </div>
  );
};

export default DividerWithDots;
