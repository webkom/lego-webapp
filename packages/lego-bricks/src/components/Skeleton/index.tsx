import cx from 'classnames';
import styles from './Skeleton.module.css';

type Props = {
  array?: number;
  className?: string;
};

export const Skeleton = ({ array = 1, className }: Props) => {
  return (
    <>
      {Array.from({ length: array }).map((_, index) => (
        <div key={index} className={cx(styles.skeleton, className)} />
      ))}
    </>
  );
};
