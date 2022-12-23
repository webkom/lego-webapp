import styles from './Octagon.css';
import type { ReactNode } from 'react';

type Props = {
  size: number | string;
  children?: ReactNode;
};

function Octagon({ size, children }: Props) {
  const style = {
    width: size,
    height: size,
  };
  return (
    <div style={style} className={styles.octagonWrapper}>
      <div style={style} className={styles.octagon}>
        {children}
      </div>
    </div>
  );
}

export default Octagon;
