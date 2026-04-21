import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './Tag.module.css';
import type { MouseEventHandler, ReactNode } from 'react';

export type TagColors =
  | 'red'
  | 'gray'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'orange';

type Props = {
  tag: string | ReactNode;
  icon?: string;
  iconNode?: ReactNode;
  iconSize?: number;
  color?: TagColors;
  link?: string;
  className?: string;
  gap?: string;
  active?: boolean;
  textColor?: string;
  backgroundColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  ariaLabel?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tag = ({
  tag,
  icon,
  iconNode,
  iconSize,
  color = 'red',
  link,
  className,
  gap,
  active,
  textColor,
  backgroundColor,
  onClick,
  title,
  ariaLabel,
}: Props) => {
  const tagClassName = cx(
    styles.tag,
    styles[color],
    className,
    active && styles.active,
    onClick && styles.buttonTag,
  );
  const style = {
    color: textColor,
    backgroundColor,
    gap: gap || 'var(--spacing-xs)',
  };
  const content = (
    <>
      {icon && !iconNode && <Icon name={icon} size={iconSize ?? 16} />}
      {iconNode && <Icon iconNode={iconNode} size={iconSize ?? 16} />}
      {tag}
    </>
  );

  return (
    <div className={styles.linkSpacing}>
      {link ? (
        <a
          className={cx(styles.link, tagClassName)}
          href={link}
          style={style}
          title={title}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      ) : onClick ? (
        <button
          type="button"
          className={tagClassName}
          style={style}
          onClick={onClick}
          title={title}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      ) : (
        <span className={tagClassName} style={style} title={title}>
          {content}
        </span>
      )}
    </div>
  );
};

export default Tag;
