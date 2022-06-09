// @flow

import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './Tag.css';

type Props = {
  /** The tag value - the text */
  tag: string,
  color?: 'pink' | 'red' | 'orange' | 'green' | 'cyan' | 'blue' | 'purple' | '',
  link?: string,
  className?: string,
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({ tag, color, link, className }: Props) => {
  const colorClassName = styles[color];

  return (
    <div className={styles.linkSpacing}>
      {link ? (
        <Link
          className={cx(styles.link, styles.tag, colorClassName, className)}
          to={link}
        >
          {tag}
        </Link>
      ) : (
        <span className={cx(styles.tag, colorClassName, className)}>{tag}</span>
      )}
    </div>
  );
};

export default Tag;
