// @flow

import { Component } from 'react';
import cx from 'classnames';
import styles from './Image.css';

type SrcWithPlaceholder = {
  final: string,
  placeholder: string,
};

type Props = {
  src: string | SrcWithPlaceholder,
  className?: string,
  alt: string,
  style: Object,
};

type State = {
  src: string,
  imageLoaded: boolean,
};

const isSrcProgressive = (src: string | SrcWithPlaceholder): boolean %checks =>
  typeof src === 'object';

const EMPTY_IMAGE =
  'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class ImageComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { src } = this.props;

    this.state = {
      imageLoaded: false,
      src: isSrcProgressive(src) ? src.placeholder || EMPTY_IMAGE : EMPTY_IMAGE,
    };
  }

  componentDidMount() {
    const { src } = this.props;
    if (typeof src === 'object') {
      const srcObj: Object = src;
      this.setState({ src: srcObj.placeholder });
      const image = new Image();
      image.src = srcObj.final;
      image.onload = () => {
        this.setState({ imageLoaded: true, src: srcObj.final });
      };
    }
  }

  render() {
    const { src, className, alt = 'image', style, ...rest } = this.props;
    const isProgressive = typeof src === 'object';

    const defaultClass = cx(styles.image, className);

    const finalClass = cx(
      styles.image,
      styles.finalImage,
      className,
      !this.state.imageLoaded && isProgressive && styles.blur
    );
    if (!src)
      return <div className={finalClass} style={style} {...(rest: Object)} />;

    return isProgressive ? (
      <img
        className={finalClass}
        data-src={(src: Object).final}
        src={this.state.src}
        loading="lazy"
        alt={alt}
        style={style}
        {...(rest: Object)}
      />
    ) : (
      <img
        className={defaultClass}
        src={src}
        alt={alt}
        style={style}
        {...(rest: Object)}
      />
    );
  }
}

export default ImageComponent;
