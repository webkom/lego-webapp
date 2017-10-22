// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import styles from './Image.css';

type Props = {
  src: string,
  className?: string,
  alt: string
};

type State = {
  loaded: boolean
};

class Image extends Component<Props, State> {
  static defaultProps = {
    alt: 'image'
  };

  state = {
    loaded: false
  };

  // https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    const image = new global.Image();
    image.src = this.props.src;
    image.onload = () => this._isMounted && this.setState({ loaded: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { src, className, alt, ...props } = this.props;
    return (
      <img
        className={cx(
          styles.image,
          this.state.loaded && styles.loaded,
          className
        )}
        src={src}
        alt={alt}
        {...props}
      />
    );
  }
}

export default Image;
