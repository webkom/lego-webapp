// @flow

import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import drawFancyNodes from './drawFancyNodes';
import styles from './FancyNodesCanvas.css';

type Props = {
  height: number
};

type State = {
  width: number
};

class FancyNodesCanvas extends Component<Props, State> {
  static defaultProps = {
    height: 160
  };

  state = {
    width: 0
  };

  _canvas: any;

  handleResize = debounce((e: any) => {
    this.setState(
      {
        width: e.target.innerWidth
      },
      () => this.drawGraphics()
    );
  }, 70);

  componentDidMount() {
    this.setState({ width: global.innerWidth }, () => this.drawGraphics());
    global.addEventListener('resize', this.handleResize);
  }

  drawGraphics() {
    const context = this._canvas.getContext('2d');
    drawFancyNodes(context, {
      width: this.state.width,
      height: this.props.height
    });
  }

  componentWillUnmount() {
    global.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <canvas
        ref={ref => {
          this._canvas = ref;
        }}
        className={styles.root}
        width={this.state.width}
        height={this.props.height}
      />
    );
  }
}

export default FancyNodesCanvas;
