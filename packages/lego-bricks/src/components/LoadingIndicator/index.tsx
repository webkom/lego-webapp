import cx from 'classnames';
import { Card } from '../Card';
import { Page, PageCover } from '../Layout';
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

  return children ? <>{children}</> : null;
};

type LoadingPageProps = {
  cover?: boolean;
  loading: boolean;
  children?: ReactNode;
};
export const LoadingPage = ({ cover, loading, children }: LoadingPageProps) => (
  <Page skeleton={loading} cover={cover && <PageCover skeleton />}>
    {loading ? (
      children || <LoadingIndicator loading={loading} />
    ) : (
      <Card severity="danger">
        <Card.Header>Noe gikk galt!</Card.Header>
        Siden mangler innhold.
      </Card>
    )}
  </Page>
);

export const ProgressBar = () => {
  return <div className={styles.progressLine} />;
};
