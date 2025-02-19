import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import Tooltip from '../Tooltip';
import styles from './TextWithIcon.module.css';
import type { ReactElement, ReactNode } from 'react';

export type TextWithIconProps = {
  iconName?: string;
  iconNode?: ReactNode;
  className?: string;
  content: ReactNode;
  tooltipContent?: ReactElement;
  iconRight?: boolean;
  size?: number;
  gap?: number | string;
};

const TextWithIcon = ({
  iconName,
  iconNode,
  className,
  content,
  tooltipContent,
  iconRight = false,
  size,
  gap = 'var(--spacing-sm)',
}: TextWithIconProps) => {
  const icon = (
    <Icon
      name={iconName}
      iconNode={iconNode}
      className={styles.infoIcon}
      size={size ? size : undefined}
    />
  );

  return (
    <Flex
      alignItems="center"
      gap={gap}
      className={cx(styles.overflowWrap, className)}
    >
      {iconRight && (
        <div className={styles.textContainer}>
          <span>{content}</span>
        </div>
      )}
      {tooltipContent ? (
        <Tooltip content={tooltipContent}>{icon}</Tooltip>
      ) : (
        <>{icon}</>
      )}
      <div>{iconRight ? <></> : <>{content}</>}</div>
    </Flex>
  );
};

export default TextWithIcon;
