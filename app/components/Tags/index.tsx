import styles from './Tag.css';
import type { Node } from 'react';

type Props = {
  children: Node;
  className?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tags = ({ children, className }: Props) => {
  return <div className={className ? className : styles.tags}>{children}</div>;
};

export default Tags;
