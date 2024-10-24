import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Tag.module.css';

const tagColors = [
  'red',
  'gray',
  'pink',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'orange',
] as const;

export type TagColors = (typeof tagColors)[number];

type Props = {
  tag: string;
  icon?: string;
  iconSize?: number;
  color?: TagColors;
  link?: string;
  className?: string;
  active?: boolean;
  textColor?: string;
  backgroundColor?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({
  tag,
  icon,
  iconSize,
  color = 'red',
  link,
  className,
  active,
  textColor,
  backgroundColor,
}: Props) => (
  <div className={styles.linkSpacing}>
    {link ? (
      <Link
        className={cx(
          styles.link,
          styles.tag,
          styles[color],
          className,
          active && styles.active,
        )}
        to={link}
        style={{ color: textColor, backgroundColor }}
      >
        {tag}
      </Link>
    ) : (
      <Flex
        gap="var(--spacing-xs)"
        alignItems="center"
        className={cx(styles.tag, styles[color], className)}
        style={{ color: textColor, backgroundColor: backgroundColor }}
      >
        {icon && <Icon name={icon} size={iconSize ?? 16} />}
        {tag}
      </Flex>
    )}
  </div>
);

export default Tag;
