import React from 'react';
import Image from './Image';

interface Props {
  src: any;
  size: number;
  style?: Object;
}

function CircularPicture({ src, size = 100, style, ...props }: Props) {
  return (
    <Image
      src={src}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...style
      }}
      {...props}
    />
  );
}

export default CircularPicture;
