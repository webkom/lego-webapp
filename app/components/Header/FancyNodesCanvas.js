// @flow

import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import drawFancyNodes from './drawFancyNodes';
import styles from './FancyNodesCanvas.css';
import { getTheme } from 'app/utils/themeUtils.js';

type Props = {
  height: number
};

type State = {
  width: number,
  currentTheme: string
};

class FancyNodesCanvas extends Component<Props, State> {
  static defaultProps = {
    height: 160
  };

  state = {
    width: 0,
    currentTheme: 'light'
  };

  _canvas: any;

  handleResize = debounce((e: any) => {
    const newWidth = e.target.innerWidth;
    const { width } = this.state;

    if (newWidth === width) return;

    this.setState(
      {
        width: newWidth
      },
      () => this.drawGraphics()
    );
  }, 70);

  handleThemeChange = () => {
    const newTheme = getTheme();
    const { currentTheme } = this.state;

    if (newTheme === currentTheme) return;

    this.setState(
      {
        currentTheme: newTheme
      },
      () => this.drawGraphics()
    );
  };

  componentDidMount() {
    this.setState({ width: global.innerWidth }, () => this.drawGraphics());
    global.addEventListener('resize', this.handleResize);
    global.addEventListener('themeChange', this.handleThemeChange);
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
    global.removeEventListener('themeChange', this.handleThemeChange);
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
