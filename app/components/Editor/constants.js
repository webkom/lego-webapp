
export const HYPERLINK = 'hyperlink';
export const HANDLED = 'handled';
export const NOT_HANDLED = 'not_handled';

export const Block = {
  UNSTYLED: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  ATOMIC: 'atomic',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break',
  EMBED: 'atomic:embed'
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

export const BlockButtons = [
  {
    label: 'H3',
    style: 'header-three',
    icon: 'header',
    description: 'Heading 3'
  },
  {
    label: 'Q',
    style: 'blockquote',
    icon: 'quote-right',
    description: 'Blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: 'list-ul',
    description: 'Unordered List'
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    icon: 'list-ol',
    description: 'Ordered List'
  },
  {
    label: 'TODO',
    style: 'todo',
    icon: 'check',
    description: 'Todo List'
  }
];

export const InlineButtons = [
  {
    label: 'B',
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold'
  },
  {
    label: 'I',
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic'
  },
  {
    label: 'U',
    style: 'UNDERLINE',
    icon: 'underline',
    description: 'Underline'
  },
  {
    label: 'S',
    style: 'STRIKETHROUGH',
    icon: 'strikethrough',
    description: 'Strikethrough'
  },
  {
    label: 'Hi',
    style: 'HIGHLIGHT',
    icon: 'paint-brush',
    description: 'Highlight selection'
  },
  {
    label: 'Code',
    style: 'CODE',
    icon: 'code',
    description: 'Inline Code'
  }
];

export const customStyleMap = {
  [Inline.HIGHLIGHT]: {
    backgroundColor: 'yellow'
  },
  [Inline.CODE]: {
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    margin: '4px 0',
    fontSize: '0.9em',
    padding: '1px 3px',
    color: '#555',
    backgroundColor: '#fcfcfc',
    border: '1px solid #ccc',
    borderBottomColor: '#bbb',
    borderRadius: 3,
    boxShadow: 'inset 0 -1px 0 #bbb'
  }
};
