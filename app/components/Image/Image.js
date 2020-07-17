// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import styles from './Image.css';

type Props = {
  src: string,
  className?: string,
  alt: string,
  style: Object,
};

class Image extends Component<Props> {
  static defaultProps = {
    alt: 'image',
  };

  render() {
    const { src, className, alt, style, ...props } = this.props;
    const finalClass = cx(styles.image, className);
    if (!src) return <div className={finalClass} style={style} />;
    return (
      <img
        className={finalClass}
        src={src}
        alt={alt}
        style={style}
        {...props}
      />
    );
  }
}

export default Image;
