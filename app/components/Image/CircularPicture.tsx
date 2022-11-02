import Image from './Image';
type Props = {
  src: any;
  placeholder?: string;
  alt: string;
  size: number;
  style?: Record<string, any>;
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
    style={{ ...style, borderRadius: size / 2, width: size, height: size }}
    {...(props as Record<string, any>)}
  />
);

export default CircularPicture;
