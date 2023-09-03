import cx from 'classnames';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import styles from './Tag.css';

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
  color?: TagColors;
  link?: string;
  className?: string;
  active?: boolean;
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({ tag, icon, color = 'red', link, className, active }: Props) => (
  <div className={styles.linkSpacing}>
    {link ? (
      <Link
        className={cx(
          styles.link,
          styles.tag,
          styles[color],
          className,
          active && styles.active
        )}
        to={link}
      >
        {tag}
      </Link>
    ) : (
      <Flex
        gap={5}
        alignItems="center"
        className={cx(styles.tag, styles[color], className)}
      >
        {icon && <Icon name={icon} size={16} />}
        {tag}
      </Flex>
    )}
  </div>
);

export default Tag;
