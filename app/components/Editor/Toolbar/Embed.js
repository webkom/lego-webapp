// @flow

import React, { Component } from 'react';
import { Block } from '../constants';
import { addNewBlock } from '../utils';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

type Props = {
  close: () => void,
  onChange: () => void,
  editorState: Object
};

export default class Embed extends Component {

  props: Props;

  onClick = () => {
    const url = window.prompt('Enter a URL', 'https://www.youtube.com/watch?v=PMNFaAUs2mo');
    this.props.onClose();
    if (!url) return;
    this.addEmbedURL(url);
  }

  addEmbedURL = (url) => {
    this.props.onChange(addNewBlock(
        this.props.editorState,
        Block.EMBED,
        { url }
    ));
    this.props.onClose();
  }


  render() {
    return (
      <span
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          console.log(e);
          e.preventDefault();
          e.stopPropagation();
          this.onClick();
        }}
      >
        <Icon name='code' />
      </span>
    );
  }
}
