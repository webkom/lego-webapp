/* eslint-disable new-cap */
import { EditorState, genKey, ContentBlock } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { Map } from 'immutable';
import Link, { findLinkEntities } from './Entities/Link';
import { Block, Inline } from './constants';

export const toHTML = (content) => convertToHTML({
  blockToHTML: {
    [Block.UNSTYLED]: {
      start: '<p>',
      end: '</p>',
      empty: ''
    },
    [Block.BREAK]: {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    },
    [Block.EMBED]: {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    }
  },
  styleToHTML: {
    [Inline.STRIKETHROUGH]: {
      start: '<span style="text-decoration: line-through;">',
      end: '</span>'
    },
    [Inline.HIGHLIGHT]: {
      start: '<mark>',
      end: '</mark>'
    }
  },
  entityToHTML: (entity, originalText) => {
    console.log(entity);
    if (entity.type === 'mention') {
      return `<a class="mention"
        data-username="${entity.data.mention.get('username')}"
        href="${entity.data.mention.get('link')}"
        >${originalText}</a>`;
    }

    if (entity.type === 'LINK') {
      return `<a href="${entity.data.url}">${originalText}</a>`;
    }

    return originalText;
  }
})(content);

export const customDecorators = ([
  {
    strategy: findLinkEntities,
    component: Link
  }
]);

/**
 * Initializes EditorState, either with
 * content or empty depending on the argument.
 */
export const createEditorState = (content) => {
  if (content) {
    const editorState = convertFromHTML(content);
    return EditorState.createWithContent(editorState);
  }

  return EditorState.createEmpty();
};

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
 *Adds a new block (currently replaces an empty block) at the current cursor position
 *of the given `newType`.
 */
export const addNewBlock = (editorState, newType = Block.UNSTYLED, initialData = {}) => {
  const selectionState = editorState.getSelection();
  console.log(selectionState);
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

/*
Used from [react-rte](https://github.com/sstur/react-rte/blob/master/src/lib/insertBlockAfter.js)
by [sstur](https://github.com/sstur)
*/
export const addNewBlockAt = (
    editorState,
    pivotBlockKey,
    newBlockType = Block.UNSTYLED,
    initialData = {}
  ) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const block = blockMap.get(pivotBlockKey);
  const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === block));
  const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest();
  const newBlockKey = genKey();

  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: newBlockType,
    text: '',
    characterList: block.getCharacterList().slice(0, 0),
    depth: 0,
    data: Map(getDefaultBlockData(newBlockType, initialData))
  });

  const newBlockMap = blocksBefore.concat(
    [[pivotBlockKey, block], [newBlockKey, newBlock]],
    blocksAfter
  ).toOrderedMap();

  const selection = editorState.getSelection();

  const newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false
    })
  });
  return EditorState.push(editorState, newContent, 'split-block');
};

/*
Changes the block type of the current block.
*/
export const resetBlockWithType = (editorState, newType = Block.UNSTYLED) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  let newText = '';
  const text = block.getText();
  if (block.getLength() >= 2) {
    newText = text.substr(1);
  }
  const newBlock = block.merge({
    text: newText,
    type: newType,
    data: getDefaultBlockData(newType)
  });
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0
    })
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};

/*
Update block-level metadata of the given `block` to the `newData`/
*/
export const updateDataOfBlock = (editorState, block, newData) => {
  const contentState = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: newData
  });
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock)
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};
