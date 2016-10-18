// @flow

import React, { Component } from 'react';
import { Block } from '../constants';
import { addNewBlock } from '../models';
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
    this.props.onChange(addNewBlock(
        this.props.editorState,
        Block.BREAK
    ));
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
