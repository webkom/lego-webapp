import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './Tag.module.css';
import type { ReactNode } from 'react';

export type TagColors =
  | 'red'
  | 'gray'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'black';

type Props = {
  tag: string | ReactNode;
  iconNode?: ReactNode;
  iconSize?: number;
  fontSize?: string;
  color?: TagColors;
  link?: string;
  className?: string;
  gap?: string;
  active?: boolean;
  textColor?: string;
  backgroundColor?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({
  tag,
  iconNode,
  iconSize,
  fontSize,
  color = 'red',
  link,
  className,
  gap,
  active,
  textColor,
  backgroundColor,
}: Props) => (
  <div className={styles.linkSpacing}>
    {link ? (
      <a
        className={cx(
          styles.link,
          styles.tag,
          styles[color],
          className,
          active && styles.active,
        )}
        href={link}
        style={{ color: textColor, backgroundColor, fontSize }}
      >
        {tag}
      </a>
    ) : (
      <Flex
        gap={gap || 'var(--spacing-xs)'}
        alignItems="center"
        className={cx(styles.tag, styles[color], className)}
        style={{ color: textColor, backgroundColor, fontSize }}
      >
        {iconNode && <Icon iconNode={iconNode} size={iconSize ?? 16} />}
        {tag}
      </Flex>
    )}
  </div>
);

export default Tag;
