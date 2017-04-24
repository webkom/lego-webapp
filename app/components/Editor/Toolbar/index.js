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
  isPublic: boolean,
  insertBlock: (properties) => void,
  setBlockData: (key, data) => void,
  wrapperElement: object
};

export default class Toolbar extends Component {
  state = {
    open: false,
    openUpload: false
  };
  props: Props;

  container = undefined;

  componentDidUpdate = () => {
    this.updatePosition();
  };

  componentDidMount = () => {
    this.updatePosition();
  };

  updatePosition = () => {
    const { editorState } = this.props;
    if (!this.container) return;

    const visible = editorState.isCollapsed &&
      editorState.startBlock.type === 'paragraph' &&
      editorState.startText.text === '' &&
      !editorState.isBlurred;
    if (!visible) {
      this.container.style.display = 'none';
      if (this.state.open) {
        this.setState({
          open: false
        });
      }
      return;
    }
    this.container.style.display = 'initial';

    const rect = findDOMNode(editorState.startText).getBoundingClientRect();
    const offset = this.props.wrapperElement.getBoundingClientRect();
    this.container.style.top = `${rect.top - offset.top}px`;
  };

  insertBreak = () => {
    this.props.insertBlock({
      type: Blocks.Break,
      isVoid: true,
      data: {}
    });
    this.setState({
      open: false
    });
  };

  insertImage = (image, src) => {
    const { uploadFile, setBlockData, isPublic } = this.props;
    this.props.insertBlock({
      type: Blocks.Image,
      isVoid: true,
      data: {
        setBlockData,
        blockLayout: 'full',
        uploadFile,
        isPublic,
        image,
        src
      }
    });
  };

  toggleImage = () => {
    this.setState({ ...this.state, openUpload: !this.state.openUpload });
  };

  toggle = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div
        className={styles.toolbar}
        ref={c => {
          this.container = c;
        }}
      >
        <Icon
          onMouseDown={this.toggle}
          name="add"
          className={this.state.open ? styles.activeButton : ''}
        />

        {this.state.open &&
          <div className={styles.toolbarButtons}>
            <ToolbarButton icon="remove" onClick={this.insertBreak} />
            <ToolbarButton icon="image" onClick={this.toggleImage} />
          </div>}

        {this.state.openUpload &&
          <ImageUpload
            inModal
            onClose={this.toggleImage}
            onSubmit={this.insertImage}
          />}

      </div>
    );
  }
}
