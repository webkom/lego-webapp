// @flow

import React, { Component } from 'react';
import { AtomicBlockUtils, Entity } from 'draft-js';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

type Props = {
  close: () => void,
  onChange: () => void,
  EditorState: Object
};

export default class Image extends Component {

  props: Props;

  onClick = () => {
    this.addImageURL();
  }

  addImageURL = (url) => {
    const entityKey = Entity.create('image', 'IMMUTABLE', { url });
    this.props.onChange(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.EditorState,
        entityKey,
        'I'
      )
    );
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
      </span>
    );
  }
}
