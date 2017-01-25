/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import { ImageUpload } from 'app/components/Upload';
import styles from './Toolbar.css';
import { Blocks } from '../constants';
import ToolbarButton from './ToolbarButton';
import { findDOMNode } from 'slate';

export type Props = {
  editorState: object,
  insertBlock: (properties) => void
};

export default class Toolbar extends Component {
  state = {
    open: false,
    openUpload: false
  }
  props: Props;

  container = undefined;

  componentDidUpdate = () => {
    const { editorState } = this.props;
    if (!this.container) return;

    const visible = editorState.isCollapsed &&
                    editorState.startBlock.type === 'paragraph' &&
                    editorState.startText.text === '' &&
                    !editorState.isBlurred;
    if (!visible) {
      this.container.style.display = 'none';
      return;
    }
    this.container.style.display = 'initial';
    const rect = findDOMNode(editorState.startText).getBoundingClientRect();
    this.container.style.top = `${rect.top + window.scrollY}px`;
  }

  insertBreak = () => {
    this.props.insertBlock({
      type: Blocks.Break,
      isVoid: true,
      data: {}
    });
  }

  insertImage = (image, src) => {
    this.props.insertBlock({
      type: Blocks.Image,
      isVoid: true,
      data: { image, src }
    });
  }

  toggleImage = () => {
    this.setState({ ...this.state, openUpload: !this.state.openUpload });
  }

  toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div
        className={styles.toolbar}
        style={{ top: '500px', left: '100px' }}
        ref={(c) => { this.container = c; }}
      >
        <Icon
          onMouseDown={this.toggle}
          name='plus'
          className={this.state.open ? styles.activeButton : ''}
        />

        {this.state.open &&
          <div className={styles.toolbarButtons}>
            <ToolbarButton
              icon='minus'
              onClick={this.insertBreak}
            />
            <ToolbarButton
              icon='picture-o'
              onClick={this.toggleImage}
            />
          </div>
        }

        {this.state.openUpload &&
          <ImageUpload
            inModal
            onClose={this.toggleImage}
            onSubmit={this.insertImage}
          />
        }

      </div>
    );
  }
}
