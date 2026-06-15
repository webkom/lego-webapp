import { Flex } from '@webkom/lego-bricks';
import Circle from '../Circle';
import styles from './index.module.css';
import type { CSSProperties } from 'react';

type Props = {
  size?: number | string;
  color?: string;
  style?: CSSProperties;
  length?: number;
};

/**
 * A Line og Abakus circles
 */
function CircleLine({ size = 10, color = 'var(--color-gray-4)', style , length = 1}: Props) {
    if (length > 7) {
        length = 7;
    }
  return (
    <Flex>
            <Flex gap="var(--spacing-sm)" className={styles.circles}>
                {Array.from({ length }).map((_, index) => (
                    <Circle
                    key={index}
                    size={size}
                    color={color}
                    style={style}
                    />
                ))}
                {Array.from({ length: 7 - length }).map((_, index) => (
                    <Circle
                    key={index}
                    size={size}
                    color="#00000000"
                    style={style}
                    />
                ))}
            </Flex>
            <div className={styles.line}></div>
    </Flex>
  );
}

export default CircleLine;
