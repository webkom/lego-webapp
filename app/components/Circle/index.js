// @flow

import React from 'react';

type Props = {
  size?: number,
  color?: string,
  style?: any
};

function Circle({ size = 10, color = '#ddd', style }: Props) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        display: 'inline-block',
        ...style
      }}
    />
  );
}

export default Circle;
