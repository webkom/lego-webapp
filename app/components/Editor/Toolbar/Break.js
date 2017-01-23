// @flow

import React, { Component } from 'react';
import {
  AtomicBlockUtils,
  Entity
} from 'draft-js';
import { Block } from '../constants';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

type Props = {
  close: () => void,
  onChange: () => void,
  editorState: Object
};

export default class Break extends Component {

  props: Props;

  onClick = () => {
    const entityKey = Entity.create(Block.BREAK, 'IMMUTABLE', {});
    this.props.onChange(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.editorState,
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
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onClick();
        }}
      >
        <Icon name='minus' />
      </span>
    );
  }
}
