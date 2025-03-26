import cx from 'classnames';
import { Flex } from '../Layout';
import styles from './Card.module.css';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  hoverable?: boolean;
  shadow?: boolean;
  className?: string;
};

/**
 * Simple base card component, without any styling except the base card.
 *
 * Should be used with CardContent and CardFooter components, in order to have a consistent look.
 */
export const BaseCard = ({ children, hoverable, shadow, className }: Props) => (
  <Flex
    column
    className={cx(
      styles.baseCard,
      hoverable && styles.isHoverable,
      shadow && styles.shadow,
      className,
    )}
  >
    {children}
  </Flex>
);

export const CardContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cx(styles.padded, className)}>{children}</div>;

export const CardFooter = ({
  children,
  className,
  ...flexProps
}: {
  children: ReactNode;
  className?: string;
} & ComponentProps<typeof Flex>) => (
  <Flex className={cx(styles.footer, className)} {...flexProps}>
    {children}
  </Flex>
);
