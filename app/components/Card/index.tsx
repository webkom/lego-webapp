import cx from 'classnames';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import styles from './Card.css';
import type { HTMLAttributes, ReactNode } from 'react';

type Severity = 'danger' | 'info' | 'success';

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
      icon = (
        <Icon name="alert-circle-outline" className={styles.warningIcon} />
      );
      break;
    case 'info':
      icon = (
        <Icon name="information-circle-outline" className={styles.infoIcon} />
      );
      break;
    case 'success':
      icon = (
        <Icon name="checkmark-circle-outline" className={styles.successIcon} />
      );
      break;
  }

  return icon !== undefined ? (
    <Flex gap={20}>
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
  severity?: Severity;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  shadow = true,
  hideOverflow = false,
  isHoverable = false,
  severity,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        className,
        styles.card,
        shadow && styles.shadow,
        isHoverable && styles.isHoverable,
        severity && styles[severity]
      )}
      style={{
        overflow: hideOverflow ? 'hidden' : 'initial',
      }}
      {...htmlAttributes}
    >
      <CardContent severity={severity}>{children}</CardContent>
    </div>
  );
}

Card.Header = CardHeader;

export default Card;
