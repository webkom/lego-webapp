// @flow

import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import { addNewBlock } from '../utils';
import { Block } from '../constants';
import { ImageUpload } from 'app/components/Upload';
import styles from './Toolbar.css';

type Props = {
  close: () => void,
  onChange: () => void,
  EditorState: Object
};

export default class Image extends Component {
  props: Props;

  state = {
    showModal: false
  }

  onClick = () => {
    this.setState({ showModal: true });
  }

  onSubmit = (blob) => {
    this.addImage(blob);
  }

  onClose = () => {
    this.props.onClose();
  }

  addImage = (image) => {
    this.props.onChange(addNewBlock(
        this.props.editorState,
        Block.IMAGE,
        { image }
    ));
    this.props.onClose();
  }


  render() {
    return (
      <span
        className={styles.toolbarButton}
        onClick={(e) => {
          e.preventDefault();
          this.onClick();
        }}
      >
        <Icon name='picture-o' />

        {this.state.showModal &&
          <ImageUpload
            onClose={this.onClose}
            onSubmit={this.onSubmit}
            inModal
          />
        }
      </span>
    );
  }
}
