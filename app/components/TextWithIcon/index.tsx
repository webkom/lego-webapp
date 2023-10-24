import Icon from '../Icon';
import { Flex } from '../Layout';
import Tooltip from '../Tooltip';
import styles from './TextWithIcon.css';
import type { ReactElement, ReactNode } from 'react';

type Props = {
  iconName: string;
  className?: string;
  content: ReactNode;
  tooltipContentIcon?: ReactElement;
  iconRight?: boolean;
  size?: number;
};

const TextWithIcon = ({
  iconName,
  className,
  content,
  tooltipContentIcon,
  iconRight = false,
  size,
}: Props) => {
  return (
    <Flex alignItems="center" gap={5} className={className}>
      <div className={styles.textContainer}>
        {iconRight ? <span>{content}</span> : <></>}
      </div>
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
