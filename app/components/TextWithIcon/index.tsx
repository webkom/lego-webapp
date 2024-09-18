import { Flex, Icon } from '@webkom/lego-bricks';
import Tooltip from '../Tooltip';
import styles from './TextWithIcon.css';
import type { ReactElement, ReactNode } from 'react';

export type TextWithIconProps = {
  iconName?: string;
  iconNode?: ReactNode;
  className?: string;
  content: ReactNode;
  tooltipContentIcon?: ReactElement;
  iconRight?: boolean;
  size?: number;
  gap?: number | string;
};

const TextWithIcon = ({
  iconName,
  iconNode,
  className,
  content,
  tooltipContentIcon,
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
    <Flex alignItems="center" gap={gap} className={className}>
      {iconRight && (
        <div className={styles.textContainer}>
          <span>{content}</span>
        </div>
      )}
      {tooltipContentIcon ? (
        <Tooltip content={tooltipContentIcon}>{icon}</Tooltip>
      ) : (
        <>{icon}</>
      )}
      <div className={styles.overflowWrap}>
        {iconRight ? <></> : <>{content}</>}
      </div>
    </Flex>
  );
};

export default TextWithIcon;
