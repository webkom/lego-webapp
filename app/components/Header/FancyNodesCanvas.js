// @flow

import React, { Component } from 'react';
import debounce from 'lodash/debounce';
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
    width: global.innerWidth
  };

  _canvas: any;

  handleResize = debounce((e: any) => {
    this.setState({
      width: e.target.innerWidth
    }, () => this.drawGraphics());
  }, 70);

  componentDidMount() {
    global.addEventListener('resize', this.handleResize);
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
    global.removeEventListener('resize', this.handleResize);
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
