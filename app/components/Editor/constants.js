/* eslint-disable react/display-name */

import React from 'react';

/**
 * Block tags
 *
 * @type {Object}
 */
export const BLOCK_TAGS = {
  blockquote: {
    name: 'quote',
    icon: '😎'
  },
  p: {
    name: 'paragraph',
    icon: '😎'
  },
  pre: {
    name: 'code',
    icon: '😎'
  },
  h1: {
    name: 'header-one',
    icon: '😎'
  },
  h2: {
    name: 'header-two',
    icon: '😎'
  },
  img: {
    name: 'image',
    icon: '😎'
  },
  hr: {
    name: 'separator',
    icon: '😎'
  },
  todo: {
    name: 'todo',
    icon: '😎'
  },
  ol: {
    name: 'list-ol',
    icon: '😎'
  },
  ul: {
    name: 'list-ul',
    icon: '😎'
  },
  li: {
    name: 'list-item',
    icon: '😎'
  }
};

/**
 * Mark tags
 *
 * @type {Object}
 */
export const MARK_TAGS = {
  em: {
    name: 'italic',
    icon: '😎'
  },
  strong: {
    name: 'bold',
    icon: '😎'
  },
  u: {
    name: 'underline',
    icon: '😎'
  },
  code: {
    name: 'code',
    icon: '😎'
  },
  href: {
    name: 'link',
    icon: '😎'
  },
  strike: {
    name: 'strikethrough',
    icon: '😎'
  }
};

/**
 * Define a schema.
 *
 * @type {Object}
 */

export const schema = {
  marks: {
    bold: ({ children }: { children: ReactElement }) =>
      <strong>
        {children}
      </strong>,
    code: ({ children }: { children: ReactElement }) =>
      <code>
        {children}
      </code>,
    italic: ({ children }: { children: ReactElement }) =>
      <em>
        {children}
      </em>,
    underlined: ({ children }: { children: ReactElement }) =>
      <u>
        {children}
      </u>
  }
};
