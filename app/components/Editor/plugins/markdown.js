import { Value } from 'slate';

import React from 'react';

/**
 * On key down, check for our specific key shortcuts.
 */
const MarkdownShortcuts = {
  onKeyDown: (event, editor, next) => {
    switch (event.key) {
      case ' ':
        return onSpace(event, editor, next);
      case 'Backspace':
        return onBackspace(event, editor, next);
      default:
        return next();
    }
  }
};

const getType = chars => {
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return 'ul_list';
    case '#':
      return 'h1';
    case '##':
      return 'h2';
    case '###':
      return 'h3';
    case '####':
      return 'h4';
    case '#####':
      return 'h5';
    case '######':
      return 'h6';
    default:
      return null;
  }
};
/**
 * On space, if it was after an auto-markdown shortcut, convert the current
 * node into the shortcut's corresponding type.
 *
 * @param {Event} event
 * @param {Editor} editor
 * @param {Function} next
 */

const onSpace = (event, editor, next) => {
  const { value } = editor;
  const { selection } = value;
  if (selection.isExpanded) return next();

  const { startBlock } = value;
  const { start } = selection;
  const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '');
  const type = getType(chars);
  if (!type) return next();
  if (type === 'ul_list' && editor.isList()) return next();
  event.preventDefault();

  editor.setBlocks(type);

  if (type === 'ul_list') {
    editor.setListType(type);
  }

  editor.moveFocusToStartOfNode(startBlock).delete();
};

/**
 * On backspace, if at the start of a non-paragraph, convert it back into a
 * paragraph node.
 *
 * @param {Event} event
 * @param {Editor} editor
 * @param {Function} next
 */

const onBackspace = (event, editor, next) => {
  const { value } = editor;
  const { selection } = value;
  if (selection.isExpanded) return next();
  if (selection.start.offset !== 0) return next();

  const { startBlock } = value;
  if (startBlock.type === 'paragraph') return next();

  event.preventDefault();
  editor.setBlocks('paragraph');
};

export default MarkdownShortcuts;
