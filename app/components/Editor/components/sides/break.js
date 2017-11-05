//@flow

import React from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import SideButton from './SideButton';

type Props = {
  setEditorState: (EditorState, () => void) => void,
  getEditorState: () => EditorState,
  close: () => void
};

const BreakButton = ({ getEditorState, setEditorState, close }: Props) => (
  <SideButton
    active={false}
    icon="minus"
    onClick={() => {
      let editorState = getEditorState();
      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity(
        'separator',
        'IMMUTABLE',
        {}
      );
      const entityKey = contentWithEntity.getLastCreatedEntityKey();
      editorState = EditorState.push(
        editorState,
        contentWithEntity,
        'create-entity'
      );
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '-'),
        close
      );
    }}
  />
);

export default BreakButton;
