// @flow
export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break'
};

export const Inline = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE',
  HIGHLIGHT: 'HIGHLIGHT'
};

export const Entity = {
  LINK: 'LINK'
};

export const HYPERLINK = 'hyperlink';
export const HANDLED = 'handled';
export const NOT_HANDLED = 'not_handled';

export const KEY_COMMANDS = {
  addNewBlock: () => 'add-new-block',
  changeType: (type: string = '') => `changetype:${type}`,
  showLinkInput: () => 'showlinkinput',
  unlink: () => 'unlink',
  toggleInline: (type: string = '') => `toggleinline:${type}`,
  deleteBlock: () => 'delete-block'
};

export default {
  Block,
  Inline,
  Entity
};
