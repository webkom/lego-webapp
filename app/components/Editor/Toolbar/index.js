import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import ReactDOM from 'react-dom';
import styles from './Toolbar.css';
import Seperator from './Seperator';
import Embed from './Embed';
import Image from './Image';

export type Props = {
  active: boolean,
  onChange: () => void,
  getEditorState: () => void
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
    const currentBlockKey = this.props.editorState.getSelection().getAnchorKey();
    const blockLength = this.props.editorState.getCurrentContent()
      .getBlockForKey(currentBlockKey).getLength();

    if (blockLength === 0 && this.props.active) {
      return (
          <div className={styles.toolbar} style={{ top: this.state.top }}>

            <Icon
              onClick={() => {
                this.setState({ open: !this.state.open });
              }}
              name='plus'
              className={this.state.open ? styles.activeButton : ''}
            />

          {this.state.open && <div className={styles.toolbarButtons}>
              <Seperator
                onChange={this.props.onChange}
                onClose={this.handleClose}
                getEditorState={this.props.getEditorState}
              />
              <Embed
                onChange={this.props.onChange}
                onClose={this.handleClose}
                getEditorState={this.props.getEditorState}
              />
              <Image
                onChange={this.props.onChange}
                onClose={this.handleClose}
                getEditorState={this.props.getEditorState}
              />
            </div>}

        </div>
        );
    }
    return null;
  }
}
