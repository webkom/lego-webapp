// @flow

import React from 'react';
import { BLOCK_TAGS, MARK_TAGS } from './constants';

function serialize(object, children) {
  if (object.kind == 'block' && object.type == 'paragraph') {
    return <p>{children}</p>;
  }
}

function deserialize(el, next) {
  if (el.tagName.toLowerCase() == 'p') {
    return {
      kind: 'block',
      type: 'paragraph',
      nodes: next(el.childNodes)
    };
  }
}

const rules = [
  ...MARK_TAGS,
  ...BLOCK_TAGS,
  {
    serialize,
    deserialize
  }
];

export default rules;
