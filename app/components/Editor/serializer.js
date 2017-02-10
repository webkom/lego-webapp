/* eslint-disable consistent-return */
/* eslint-disable default-case */

import React from 'react';

const BLOCK_TAGS = {
  blockquote: 'quote',
  br: 'paragraph',
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
      if (object.kind !== 'block') return;
      const data = object.data.toJS();
      switch (object.type) {
        case 'image': return <img data-file-token={data.fileToken} />;
        case 'break': return <hr />;
        case 'code': return <pre><code>{children}</code></pre>;
        case 'paragraph': return children.length ? <p>{children}</p> : <br />;
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
      if (object.kind !== 'mark') return;
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>;
        case 'italic': return <em>{children}</em>;
        case 'underline': return <u>{children}</u>;
        case 'strikethrough': return <strike>{children}</strike>;
      }
    }
  }
];
