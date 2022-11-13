import Image from './Image';
import type { ComponentProps } from 'react';

type Props = {
  size: number;
} & ComponentProps<typeof Image>;

const CircularPicture = ({
  src,
  placeholder,
  alt,
  size = 100,
  style,
  ...props
}: Props) => (
  <Image
    src={src}
    placeholder={placeholder}
    alt={alt}
    width={size}
    height={size}
    style={{ ...style, borderRadius: size / 2, width: size, height: size }}
    {...props}
  />
);

export default CircularPicture;
