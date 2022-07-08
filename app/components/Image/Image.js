// @flow

import { useEffect, useState } from 'react';
import cx from 'classnames';

import styles from './Image.css';

type Props = {
  src: string,
  placeholder: string,
  className?: string,
  alt: string,
  style: Object,
};

const EMPTY_IMAGE =
  'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const ImageComponent = (props: Props) => {
  const [progressiveSrc, setProgressiveSrc] = useState<string>(
    props.placeholder || EMPTY_IMAGE
  );
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [loadStart, setLoadStart] = useState<number>(0);
  const [loadEnd, setLoadEnd] = useState<number>(0);

  const { src, className, alt = 'image', style, ...rest } = props;

  const isProgressive = !!props.placeholder;

  useEffect(() => {
    setProgressiveSrc(props.placeholder || EMPTY_IMAGE);
  }, [props.placeholder]);

  useEffect(() => {
    if (isProgressive) {
      setImageLoaded(false);
      setImageError(false);
      setLoadStart(Date.now());
    }
    const image = new Image();
    image.src = src;
    image.onload = () => {
      setImageLoaded(true);
      setLoadEnd(Date.now());
      setProgressiveSrc(src);
    };
    image.onerror = () => {
      setImageError(true);
    };
  }, [isProgressive, src]);

  const defaultClass = cx(styles.image, className);

  // Skip the transition effect if the image loads very quick.
  // F.ex. when high bandwith or cached
  const skipTransition = loadEnd - loadStart < 500;

  const finalClass = cx(
    styles.image,
    !skipTransition && styles.finalImage,
    className,
    !imageLoaded && !imageError && isProgressive && styles.blur
  );

  if (!src)
    return <div className={finalClass} style={style} {...(rest: Object)} />;

  return (
    <img
      className={isProgressive ? finalClass : defaultClass}
      src={isProgressive ? progressiveSrc : src}
      loading="lazy"
      alt={alt}
      style={style}
      {...(rest: Object)}
    />
  );
};

export default ImageComponent;
