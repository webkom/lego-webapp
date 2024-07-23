import type { CSSProperties } from 'react';

type Props = {
  size?: number | string;
  color?: string;
  style?: CSSProperties;
};

/**
 * A basic Cirlce component
 */
function Circle({ size = 10, color = 'var(--color-gray-4)', style }: Props) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        ...style,
      }}
    />
  );
}

export default Circle;
