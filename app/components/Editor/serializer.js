import React from 'react';
import { Blocks, Inline } from './constants';

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code'
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
  strike: 'strikethrough'
};

export default [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'block',
        type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind != 'block') return;
      switch (object.type) {
        case 'code': return <pre><code>{children}</code></pre>;
        case 'paragraph': return <p>{children}</p>;
        case 'quote': return <blockquote>{children}</blockquote>;
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'mark',
        type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind != 'mark') return;
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>;
        case 'italic': return <em>{children}</em>;
        case 'underline': return <u>{children}</u>;
        case 'strikethrough': return <strike>{children}</strike>;
      }
    }
  }
];
