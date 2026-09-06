import cx from 'classnames';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { Icon } from '../Icon';
import Flex from '../Layout/Flex';
import { Skeleton } from '../Skeleton';
import { BaseCard } from './BaseCard';
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

type ContentWithIconProps = {
  severity?: Severity;
  iconSize?: number;
  children: ReactNode;
};

const ContentWithIcon = ({
  children,
  severity,
  iconSize,
}: ContentWithIconProps) => {
  let icon;

  switch (severity) {
    case 'danger':
      icon = (
        <Icon
          iconNode={<CircleAlert />}
          size={iconSize}
          className={styles.dangerIcon}
        />
      );
      break;
    case 'info':
      icon = (
        <Icon iconNode={<Info />} size={iconSize} className={styles.infoIcon} />
      );
      break;
    case 'success':
      icon = (
        <Icon
          iconNode={<CircleCheck />}
          size={iconSize}
          className={styles.successIcon}
        />
      );
      break;
    case 'warning':
      icon = (
        <Icon
          iconNode={<TriangleAlert />}
          size={iconSize}
          className={styles.warningIcon}
        />
      );
      break;
  }

  return icon !== undefined ? (
    <Flex className={styles.withIcon}>
      {icon}
      <div className={styles.withIconContent}>{children}</div>
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
  iconSize?: number;
} & HTMLAttributes<HTMLDivElement>;

export const Card = ({
  children,
  className,
  shadow = true,
  hideOverflow: _hideOverflow,
  isHoverable = false,
  skeleton = false,
  severity,
  iconSize,
  ...htmlAttributes
}: Props) => {
  return (
    <BaseCard
      hoverable={isHoverable}
      shadow={shadow}
      className={cx(
        className,
        !skeleton && styles.padded,
        severity && styles[severity],
      )}
      {...htmlAttributes}
    >
      {skeleton ? (
        <Skeleton />
      ) : (
        <ContentWithIcon severity={severity} iconSize={iconSize}>
          {children}
        </ContentWithIcon>
      )}
    </BaseCard>
  );
};

Card.Header = CardHeader;
