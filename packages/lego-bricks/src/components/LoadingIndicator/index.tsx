import cx from 'classnames';
import styles from './LoadingIndicator.module.css';
import type { ReactNode, CSSProperties } from 'react';

export type LoadingIndicatorProps = {
  loading: boolean;
  small?: boolean;
  margin?: number | string;
  loadingStyle?: CSSProperties;
  children?: ReactNode;
  className?: string;
};

export const LoadingIndicator = ({
  loading,
  small,
  margin,
  loadingStyle,
  children,
  className,
}: LoadingIndicatorProps) => {
  const spinnerStyle = small ? styles.small : styles.spinner;

  if (loading) {
    return (
      <div
        className={cx(spinnerStyle, className)}
        style={{ ...loadingStyle, margin: margin }}
      >
        <div className={styles.bounce1} />
        <div className={styles.bounce2} />
      </div>
    );
  }

  return children ? <div>{children}</div> : null;
};

export const ProgressBar = () => {
  return <div className={styles.progressLine} />;
};
