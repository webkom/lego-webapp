import { Flex, Icon } from '@webkom/lego-bricks';
import Tooltip from '../Tooltip';
import styles from './TextWithIcon.css';
import type { ReactElement, ReactNode } from 'react';

export type TextWithIconProps = {
  iconName: string;
  className?: string;
  content: ReactNode;
  tooltipContentIcon?: ReactElement;
  iconRight?: boolean;
  size?: number;
  gap?: number;
};

const TextWithIcon = ({
  iconName,
  className,
  content,
  tooltipContentIcon,
  iconRight = false,
  size,
  gap = 5,
}: TextWithIconProps) => {
  return (
    <Flex alignItems="center" gap={gap} className={className}>
      {iconRight && (
        <div className={styles.textContainer}>
          <span>{content}</span>
        </div>
      )}
      {tooltipContentIcon ? (
        <Tooltip content={tooltipContentIcon}>
          <Icon
            name={iconName}
            className={styles.infoIcon}
            size={size ? size : undefined}
          />
        </Tooltip>
      ) : (
        <Icon
          name={iconName}
          className={styles.infoIcon}
          size={size ? size : undefined}
        />
      )}
      <div>{iconRight ? <></> : <>{content}</>}</div>
    </Flex>
  );
};

export default TextWithIcon;
