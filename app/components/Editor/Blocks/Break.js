import React from 'react';
import styles from './Break.css';

export default (props) => {
  const { node, state } = props;
  const isFocused = state.selection.hasEdgeIn(node);
  const style = isFocused ? { border: '1px solid blue' } : {};
  return <hr {...props.attributes} className={styles.hr} style={style} />;
};
