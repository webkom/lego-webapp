//@flow
import React from 'react';
import { RichUtils, EditorState } from 'draft-js';
import { HYPERLINK } from '../util/constants';
import cx from 'classnames';
import styles from './ToolbarButton.css';

type Props = {
  editorState: EditorState,
  handleLinkInput: () => void,
  onToggle: string => void,
  button: Object, //TODO Block/inline style
  type: 'inline' | 'block'
};

const ToolbarButton = ({
  type,
  button,
  onToggle,
  editorState,
  handleLinkInput
}: Props) => {
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
        if (button.style === HYPERLINK) {
          handleLinkInput(e);
        } else {
          onToggle(button.style);
        }
      }}
    >
      <i className={`fa fa-${button.icon}`} />
    </span>
  );
};

export default ToolbarButton;
