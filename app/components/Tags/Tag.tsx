import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Tag.css';

type Props = {
  /** The tag value - the text */
  tag: string;
  color?:
    | 'gray'
    | 'pink'
    | 'yellow'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'purple'
    | '';
  link?: string;
  className?: string;
  active?: boolean;
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({ tag, color, link, className, active }: Props) => (
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
      <span className={cx(styles.tag, styles[color], className)}>{tag}</span>
    )}
  </div>
);

export default Tag;
