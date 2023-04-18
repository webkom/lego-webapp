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

type Props = {
  className?: string;
  tight?: boolean;
  shadow?: boolean;
  hideOverflow?: boolean;
  isHoverable?: boolean;
  danger?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  tight = false,
  shadow = true,
  hideOverflow = false,
  isHoverable = false,
  danger = false,
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
        danger && styles.danger
      )}
      style={{
        overflow: hideOverflow ? 'hidden' : 'initial',
      }}
      {...htmlAttributes}
    >
      {danger ? (
        <Flex gap={20}>
          {danger && <Icon name="warning" className={styles.warningIcon} />}
          <Flex column>{children}</Flex>
        </Flex>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}

Card.Header = CardHeader;

export default Card;
