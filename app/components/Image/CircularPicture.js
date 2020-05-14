// @flow

import React from 'react';
import Image from './Image';

type Props = {
  src: any,
  alt: string,
  size: number,
  style?: Object,
};

const CircularPicture = ({ src, alt, size = 100, style, ...props }: Props) => (
  <Image
    src={src}
    alt={alt}
    width={size}
    height={size}
    style={{
      ...style,
      borderRadius: size / 2,
      width: size,
      height: size,
    }}
    {...props}
  />
);

export default CircularPicture;
