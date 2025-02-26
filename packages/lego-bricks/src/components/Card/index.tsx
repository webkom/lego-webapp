import cx from 'classnames';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { Icon } from '../Icon';
import Flex from '../Layout/Flex';
import { Skeleton } from '../Skeleton';
import styles from './Card.module.css';
import type { HTMLAttributes, ReactNode } from 'react';

type Severity = 'danger' | 'info' | 'success' | 'warning';

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cx(styles.header, className)}>{children}</div>
);

type CardContentProps = {
  severity?: Severity;
  children: ReactNode;
};

const CardContent = ({ children, severity }: CardContentProps) => {
  let icon;

  switch (severity) {
    case 'danger':
      icon = <Icon iconNode={<CircleAlert />} className={styles.dangerIcon} />;
      break;
    case 'info':
      icon = <Icon iconNode={<Info />} className={styles.infoIcon} />;
      break;
    case 'success':
      icon = <Icon iconNode={<CircleCheck />} className={styles.successIcon} />;
      break;
    case 'warning':
      icon = (
        <Icon iconNode={<TriangleAlert />} className={styles.warningIcon} />
      );
      break;
  }

  return icon !== undefined ? (
    <Flex className={styles.withIcon}>
      {icon}
      <Flex column>{children}</Flex>
    </Flex>
  ) : (
    <>{children}</>
  );
};

type Props = {
  className?: string;
  shadow?: boolean;
  hideOverflow?: boolean;
  isHoverable?: boolean;
  skeleton?: boolean;
  severity?: Severity;
} & HTMLAttributes<HTMLDivElement>;

export const Card = ({
  children,
  className,
  shadow = true,
  hideOverflow = false,
  isHoverable = false,
  skeleton = false,
  severity,
  ...htmlAttributes
}: Props) => {
  return (
    <div
      className={cx(
        className,
        styles.card,
        shadow && styles.shadow,
        isHoverable && styles.isHoverable,
        severity && styles[severity],
      )}
      style={{
        overflow: hideOverflow || skeleton ? 'hidden' : 'initial',
        padding: skeleton ? '0' : undefined,
      }}
      {...htmlAttributes}
    >
      {skeleton ? (
        <Skeleton />
      ) : (
        <CardContent severity={severity}>{children}</CardContent>
      )}
    </div>
  );
};

Card.Header = CardHeader;
