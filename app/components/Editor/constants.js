/* eslint-disable react/display-name */

import React from 'react';

export const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code'
};

export const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline'
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
