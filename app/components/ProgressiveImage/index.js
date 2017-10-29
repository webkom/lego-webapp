//@flow

import React, { Component } from 'react';

type Props = {
  src: string,
  alt: string,
  className?: string,
  base64?: string,
  style?: Object,
  beforeLoadstyle?: Object,
  onLoadStyle?: Object,
  blurStr?: string,
  contrastStr?: string,
  transtionTime?: string,
  transitionDelay?: string
};

type State = {
  src: string,
  style: Object
};

export default class ProgressiveImage extends Component<Props, Style> {
  props: Props;

  state: State = {
    src: this.props.base64,
    style: {
      ...this.props.beforeLoadstyle,
      filter: `blur(${this.props.blurStr}) contrast(${this.props.contrastStr})`,
      transition: `filter ${this.props.transtionTime} linear ${this.props
        .transitionDelay}`
    }
  };

  static defaultProps = {
    base64:
      'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    blurStr: '15px',
    contrastStr: '50%',
    transtionTime: '.2s',
    transitionDelay: '.05s'
  };

  fetchSrc = (url: string) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = error => reject(error);
      img.src = url;
    });

  componentDidMount() {
    this.fetchSrc(this.props.src)
      .then(url => {
        this.setState({
          src: url,
          style: {
            ...this.state.style,
            ...this.props.onLoadStyle,
            filter: 'blur(0) contrast(100%)'
          }
        });
      })
      .catch(error => {
        throw error;
      });
  }

  render() {
    return (
      <img
        src={this.state.src}
        alt={this.props.alt}
        className={this.props.className}
        style={this.state.style}
      />
    );
  }
}
