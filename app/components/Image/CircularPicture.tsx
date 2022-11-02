// @flow

import Image from './Image';

type Props = {
  src: any,
  placeholder?: string,
  alt: string,
  size: number,
  style?: Object,
};

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
    style={{
      ...style,
      borderRadius: size / 2,
      width: size,
      height: size,
    }}
    {...(props: Object)}
  />
);

export default CircularPicture;
