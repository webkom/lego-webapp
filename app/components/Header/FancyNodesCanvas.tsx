import debounce from 'lodash/debounce';
import { Component } from 'react';
import { getTheme } from 'app/utils/themeUtils';
import styles from './FancyNodesCanvas.css';
import drawFancyNodes from './drawFancyNodes';

type Props = {
  height: number;
};
type State = {
  width: number;
  currentTheme: string;
};

class FancyNodesCanvas extends Component<Props, State> {
  static defaultProps = {
    height: 160,
  };
  state = {
    width: 0,
    currentTheme: 'light',
  };
  _canvas: any;
  handleResize = debounce((e: any) => {
    const newWidth = e.target.innerWidth;
    const { width } = this.state;
    if (newWidth === width) return;
    this.setState(
      {
        width: newWidth,
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
        currentTheme: newTheme,
      },
      () => this.drawGraphics()
    );
  };

  componentDidMount() {
    this.setState(
      {
        width: window.innerWidth,
      },
      () => this.drawGraphics()
    );
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('themeChange', this.handleThemeChange);
  }

  drawGraphics() {
    const context = this._canvas.getContext('2d');

    drawFancyNodes(context, {
      width: this.state.width,
      height: this.props.height,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('themeChange', this.handleThemeChange);
  }

  render() {
    return (
      <canvas
        ref={(ref) => {
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
