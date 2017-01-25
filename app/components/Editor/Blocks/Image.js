import React, { Component } from 'react';
import styles from './Image.css';

export default class ImageBlock extends Component {

  render() {
    const { node, state, attributes } = this.props;
    const { data } = node.toJS();
    const isFocused = state.selection.hasEdgeIn(node);
    const style = isFocused ? { border: '1px solid blue' } : {};

    return (
      <img
        src={data.src}
        {...attributes}
        className={styles.image}
        style={style}
      />
    );
  }
}
