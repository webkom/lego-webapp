import React from 'react';
import { BLOCK_TAGS, MARK_TAGS } from './constants';

const rules = [
  ...MARK_TAGS,
  ...BLOCK_TAGS,
  {
    serialize: (object, children) => {
      if (object.kind == 'block' && object.type == 'paragraph') {
        return <p>{children}</p>;
      }
    },
    deserialize: (el, next) => {
      if (el.tagName.toLowerCase() == 'p') {
        return {
          kind: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes)
        };
      }
    }
  }
];

export default rules;
