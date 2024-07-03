import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTheme } from '../../ThemeContext';
import styles from './Image.module.css';
import type { ImgHTMLAttributes, CSSProperties } from 'react';

type Props = {
  src: string;
  placeholder?: string;
  className?: string;
  alt: string;
  darkModeSource?: string;
  style?: CSSProperties;
  darkThemeSource?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

const EMPTY_IMAGE =
  'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const ImageComponent = (props: Props) => {
  const [progressiveSrc, setProgressiveSrc] = useState<string>(
    props.placeholder || EMPTY_IMAGE,
  );
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [loadStart, setLoadStart] = useState<number>(0);
  const [loadEnd, setLoadEnd] = useState<number>(0);

  const {
    src,
    className,
    alt,
    style,
    darkModeSource,
    darkThemeSource,
    ...rest
  } = props;

  const theme = useTheme();
  const themedSource =
    darkThemeSource && theme === 'dark' ? darkThemeSource : src;

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
    if (darkModeSource) {
      image.src = darkModeSource;
    } else {
      image.src = src;
    }

    image.onload = () => {
      setImageLoaded(true);
      setLoadEnd(Date.now());
      setProgressiveSrc(themedSource);
    };

    image.onerror = () => {
      setImageError(true);
    };
  }, [darkModeSource, isProgressive, src, themedSource]);

  const defaultClass = cx(styles.image, className);
  // Skip the transition effect if the image loads very quick.
  // F.ex. when high bandwith or cached
  const skipTransition = loadEnd - loadStart < 500;
  const finalClass = cx(
    styles.image,
    !skipTransition && styles.finalImage,
    className,
    !imageLoaded && !imageError && isProgressive && styles.blur,
  );

  if (!themedSource)
    return <div className={finalClass} style={style} {...rest} />;

  return (
    <img
      className={isProgressive ? finalClass : defaultClass}
      src={isProgressive ? progressiveSrc : themedSource}
      loading="lazy"
      alt={alt}
      style={style}
      {...rest}
    />
  );
};

export { ImageComponent as Image };
