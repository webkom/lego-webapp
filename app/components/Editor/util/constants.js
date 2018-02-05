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

export const BLOCK_BUTTONS = [
  {
    label: 'H1',
    style: Block.H1,
    icon: 'header',
    description: 'Heading 1'
  },
  {
    label: 'H2',
    style: Block.H2,
    icon: 'font',
    description: 'Heading 2'
  },
  {
    label: 'quote',
    style: Block.BLOCKQUOTE,
    icon: 'quote-left',
    description: 'Blockquote'
  },
  {
    label: 'code',
    style: Block.CODE,
    icon: 'code',
    description: 'Code'
  },
  {
    label: 'UL',
    style: Block.UL,
    icon: 'list-ul',
    description: 'Unordered List'
  },
  {
    label: 'OL',
    style: Block.OL,
    icon: 'list-ol',
    description: 'Ordered List'
  },
  {
    label: 'CHECK',
    style: Block.TODO,
    icon: 'check-square',
    description: 'Todo List'
  }
];

export const INLINE_BUTTONS = [
  {
    label: 'B',
    style: Inline.BOLD,
    icon: 'bold',
    description: 'Bold'
  },
  {
    label: 'I',
    style: Inline.ITALIC,
    icon: 'italic',
    description: 'Italic'
  },
  {
    label: 'U',
    style: Inline.UNDERLINE,
    icon: 'underline',
    description: 'Underline'
  },
  {
    label: 'link',
    style: HYPERLINK,
    icon: 'link',
    description: 'Add a link'
  }
];

export default {
  Block,
  Inline,
  Entity
};
