import styles from './Tag.module.css';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tags = ({ children, className }: Props) => {
  return <div className={className ? className : styles.tags}>{children}</div>;
};

export default Tags;
export { default as Tag } from './Tag';
