//@flow
import React from 'react';
import { RichUtils, EditorState } from 'draft-js';
import cx from 'classnames';
import styles from './ToolbarButton.css';

type Props = {
  editorState: EditorState,
  onToggle: string => void,
  button: Object, //TODO Block/inline style
  type: 'inline' | 'block'
};

const ToolbarButton = ({ type, button, onToggle, editorState }: Props) => {
  let active = false;

  if (type === 'inline') {
    active = editorState.getCurrentInlineStyle().has(button.style);
  }

  if (type === 'block') {
    active = RichUtils.getCurrentBlockType(editorState) === button.style;
  }

  return (
    <span
      className={cx(styles.toolbarButton, active && styles.active)}
      onMouseDown={(e: SyntheticMouseEvent<*>) => {
        e.preventDefault();
        onToggle(button.style);
      }}
    >
      <i className={`fa fa-${button.icon}`} />
    </span>
  );
};

export default ToolbarButton;
