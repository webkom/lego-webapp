// @flow

import React, { Component } from 'react';
import drawFancyNodes from './drawFancyNodes';
import styles from './FancyNodesCanvas.css';

type Props = {
  height: number
};

class FancyNodesCanvas extends Component {
  props: Props;

  static defaultProps = {
    height: 160
  };

  state = {
    width: window.innerWidth
  };

  _canvas: any;

  handleResize = (e: any) => {
    this.setState({
      width: e.target.innerWidth
    }, () => this.drawGraphics());
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.drawGraphics();
  }

  drawGraphics() {
    const context = this._canvas.getContext('2d');
    drawFancyNodes(context, {
      width: this.state.width,
      height: this.props.height
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <canvas
        ref={(ref) => { this._canvas = ref; }}
        className={styles.root}
        width={this.state.width}
        height={this.props.height}
      />
    );
  }
}

export default FancyNodesCanvas;
