import React from 'react';

export default ({ size = 10, color = '#ddd', style }) => (
  <span style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    display: 'inline-block',
    ...style
  }} />
);
