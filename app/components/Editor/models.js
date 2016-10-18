import { EditorState } from 'draft-js';
import { Block } from './constants';

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
export const getDefaultBlockData = (blockType, initialData = {}) => {
  switch (blockType) {
    case Block.TODO: return { checked: false };
    default: return initialData;
  }
};


/*
Get currentBlock in the editorState.
*/
export const getCurrentBlock = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  return contentState.getBlockForKey(selectionState.getStartKey());
};


/*
Adds a new block (currently replaces an empty block) at the current cursor position
of the given `newType`.
*/
export const addNewBlock = (editorState, newType = Block.UNSTYLED, initialData = {}) => {
  console.log(editorState);
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }
  if (currentBlock.getLength() === 0) {
    if (currentBlock.getType() === newType) {
      return editorState;
    }
    const newBlock = currentBlock.merge({
      type: newType,
      data: getDefaultBlockData(newType, initialData)
    });
    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
};
