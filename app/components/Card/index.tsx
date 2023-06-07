import cx from 'classnames';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import styles from './Card.css';
import type { HTMLAttributes, ReactNode } from 'react';

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cx(styles.header, className)}>{children}</div>
);

type CardContentProps = {
  children: ReactNode;
  danger?: boolean;
  info?: boolean;
};

const CardContent = ({ children, danger, info }: CardContentProps) => {
  let icon;
  if (danger) {
    icon = <Icon name="alert-circle-outline" className={styles.warningIcon} />;
  }

  if (info) {
    icon = (
      <Icon name="information-circle-outline" className={styles.infoIcon} />
    );
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
  tight?: boolean;
  shadow?: boolean;
  hideOverflow?: boolean;
  isHoverable?: boolean;
  danger?: boolean;
  info?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  tight = false,
  shadow = true,
  hideOverflow = false,
  isHoverable = false,
  danger = false,
  info = false,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        className,
        styles.card,
        tight && styles.tight,
        shadow && styles.shadow,
        isHoverable && styles.isHoverable,
        danger && styles.danger,
        info && styles.info
      )}
      style={{
        overflow: hideOverflow ? 'hidden' : 'initial',
      }}
      {...htmlAttributes}
    >
      <CardContent danger={danger} info={info}>
        {children}
      </CardContent>
    </div>
  );
}

Card.Header = CardHeader;

export default Card;
