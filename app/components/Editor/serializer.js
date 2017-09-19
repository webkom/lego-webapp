import React from 'react';
import { BLOCK_TAGS, MARK_TAGS } from './constants';

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()].name;
      if (!type) return;
      return {
        kind: 'block',
        type: type,
        nodes: next(el.childNodes)
      };
    },
    serialize(object, children) {
      if (object.kind != 'block') return;
      switch (object.type) {
        case 'code':
          return (
            <pre>
              <code>
                {children}
              </code>
            </pre>
          );
        case 'paragraph':
          return (
            <p>
              {children}
            </p>
          );
        case 'quote':
          return (
            <blockquote>
              {children}
            </blockquote>
          );
      }
    }
  },
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()].name;
      if (!type) return;
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.childNodes)
      };
    },
    serialize(object, children) {
      if (object.kind != 'mark') return;
      switch (object.type) {
        case 'bold':
          return (
            <strong>
              {children}
            </strong>
          );
        case 'italic':
          return (
            <em>
              {children}
            </em>
          );
        case 'underline':
          return (
            <u>
              {children}
            </u>
          );
      }
    }
  }
];

export default rules;
