import { Image } from '@webkom/lego-bricks';
import type { ComponentProps } from 'react';

type Props = {
  size: number;
} & ComponentProps<typeof Image>;

const CircularPicture = ({
  src,
  placeholder,
  alt,
  size = 100,
  className,
  style,
  ...props
}: Props) => (
  <Image
    src={src}
    placeholder={placeholder}
    alt={alt}
    className={className}
    style={{ ...style, borderRadius: size / 2, width: size, height: size }}
    {...props}
  />
);

export default CircularPicture;
