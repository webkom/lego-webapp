import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import ReactDOM from 'react-dom';
import styles from './Toolbar.css';
import Break from './Break';
import Embed from './Embed';
import Image from './Image';

export type Props = {
  active: boolean,
  onChange: () => void,
  editorState: Object
};

export default class Toolbar extends Component {

  props: Props;

  state = {
    open: false,
    top: 0
  }

  componentDidMount = () => {
    this.calculateHeightOffset(this.props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.calculateHeightOffset(nextProps);
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  calculateHeightOffset = (props) => {
    if (props.editorRoot) {
      const contentBlocks = ReactDOM
        .findDOMNode(props.editorRoot)
        .getElementsByClassName('public-DraftStyleDefault-block');

      const currentBlockKey = props.editorState.getSelection().getAnchorKey();

      let top = 0;
      for (let i = 0; i < contentBlocks.length; i++) {
        const block = contentBlocks[i];
        if (block.getAttribute('data-offset-key').includes(currentBlockKey)) break;
        top += block.clientHeight;
      }

      this.setState({ top });
    }
  }

  render() {
    return (
        <div className={styles.toolbar} style={{ top: this.state.top }}>

          <Icon
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({ open: !this.state.open });
            }}
            name='plus'
            className={this.state.open ? styles.activeButton : ''}
          />

        {this.state.open && <div className={styles.toolbarButtons}>
            <Break
              onChange={this.props.onChange}
              onClose={this.handleClose}
              editorState={this.props.editorState}
            />
            <Embed
              onChange={this.props.onChange}
              onClose={this.handleClose}
              editorState={this.props.editorState}
            />
            <Image
              onChange={this.props.onChange}
              onClose={this.handleClose}
              editorState={this.props.editorState}
            />
          </div>}

      </div>
      );
  }
}
