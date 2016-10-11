// @flow

import React, { Component } from 'react';
import { AtomicBlockUtils, Entity } from 'draft-js';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

type Props = {
  close: () => void,
  onChange: () => void,
  getEditorState: () => void
};

export default class Embed extends Component {

  props: Props;

  onClick = () => {
    const url = window.prompt('Enter a URL', 'https://www.youtube.com/watch?v=PMNFaAUs2mo');
    this.props.onClose();
    if (!url) {
      return;
    }
    this.addEmbedURL(url);
  }

  addEmbedURL = (url) => {
    const entityKey = Entity.create('embed', 'IMMUTABLE', { url });
    this.props.onChange(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.getEditorState(),
        entityKey,
        'E'
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
        <Icon name='code' />
      </span>
    );
  }
}
