// @flow

import { Component } from 'react';
import cx from 'classnames';
import styles from './Image.css';

type Props = {
  src: string,
  placeholder: string,
  className?: string,
  alt: string,
  style: Object,
};

type State = {
  src: string,
  imageLoaded: boolean,
};

const EMPTY_IMAGE =
  'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class ImageComponent extends Component<Props, State> {
  isProgressive: boolean;

  constructor(props: Props) {
    super(props);

    const { placeholder } = this.props;

    this.isProgressive = !!placeholder;

    this.state = {
      imageLoaded: false,
      src: this.isProgressive ? placeholder || EMPTY_IMAGE : EMPTY_IMAGE,
    };
  }

  componentDidMount() {
    const { src } = this.props;
    if (this.isProgressive) {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        this.setState({ imageLoaded: true, src });
      };
    }
  }

  render() {
    const { src, className, alt = 'image', style, ...rest } = this.props;

    const defaultClass = cx(styles.image, className);

    const finalClass = cx(
      styles.image,
      styles.finalImage,
      className,
      !this.state.imageLoaded && this.isProgressive && styles.blur
    );
    if (!src)
      return <div className={finalClass} style={style} {...(rest: Object)} />;

    return this.isProgressive ? (
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
        loading="lazy"
        {...(rest: Object)}
      />
    );
  }
}

export default ImageComponent;
