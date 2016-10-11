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

export default class Seperator extends Component {

  props: Props;

  onClick = () => {
    const entityKey = Entity.create('separator', 'IMMUTABLE', {});
    this.props.onChange(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.getEditorState(),
        entityKey,
        '-'
      )
    );
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
        <Icon name='minus' />
      </span>
    );
  }
}
