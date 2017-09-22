/* eslint-disable react/display-name */
// @flow

import React from 'react';

export type TagKind = 'mark' | 'block';
export type MarkType =
  | 'italic'
  | 'bold'
  | 'underline'
  | 'code'
  | 'link'
  | 'strikethrough';
export type BlockType =
  | 'quote'
  | 'paragraph'
  | 'code'
  | 'header-one'
  | 'header-two'
  | 'image'
  | 'separator'
  | 'todo'
  | 'list-ol'
  | 'list-ul'
  | 'list-item';

const deserialize = (tagName, type, kind) => (el, next) => {
  if (el.tagName.toLowerCase() == tagName) {
    return {
      kind,
      type,
      nodes: next(el.childNodes)
    };
  }
};

const serialize = (type, kind: TagKind, serializer) => (object, children) => {
  if (object.kind == kind && object.type == type) {
    return serializer({ object, children });
  }
};

const genericRender = tagName => ({ children, attributes }) =>
  React.createElement(tagName, attributes, children);

const createMarkTag = (type, icon, tagName) => ({
  type,
  icon,
  tag: tagName,
  render: genericRender(tagName),
  deserialize: deserialize(tagName, type, 'mark'),
  serialize: serialize(type, 'mark', genericRender(tagName))
});

export const MARK_TAGS = [
  createMarkTag('italic', 'italic', 'em'),
  createMarkTag('bold', 'bold', 'strong'),
  createMarkTag('underline', 'underline', 'u'),
  createMarkTag('code', 'code', 'code'),
  createMarkTag('link', 'link', 'a'),
  createMarkTag('strikethrough', 'strikethrough', 'strike')
];

/*/**
 * Block tags
 *
 * @type {Object}
 */
export const BLOCK_TAGS = [
  {
    type: 'quote',
    icon: 'quote-left',
    render: ({ children }) =>
      <quote>
        {children}
      </quote>
  },
  {
    type: 'paragraph',
    render: ({ children }) =>
      <p>
        {children}
      </p>
  },
  {
    type: 'code',
    icon: 'code',
    render: ({ children }) =>
      <code>
        {children}
      </code>
  },
  {
    type: 'header-one',
    icon: 'header',
    render: ({ children }) =>
      <h1>
        {children}
      </h1>
  },
  {
    type: 'header-two',
    icon: 'font',
    render: ({ children }) =>
      <h2>
        {children}
      </h2>
  },
  {
    type: 'image',
    icon: 'image',
    render: ({ children }) => <img />
  },
  {
    type: 'separator',
    icon: 'minus',
    render: ({ children }) => <hr />
  },
  {
    type: 'todo',
    icon: 'check-square-o',
    render: ({ children }) =>
      <p>
        {children}
      </p>
  },
  {
    type: 'list-ol',
    icon: 'list-ol',
    render: ({ children }) =>
      <ol>
        {children}
      </ol>
  },
  {
    type: 'list-ul',
    icon: 'list-ul',
    render: ({ children }) =>
      <ul>
        {children}
      </ul>
  },
  {
    type: 'list-item',
    render: ({ children }) =>
      <li>
        {children}
      </li>
  }
];

/**
 * Define a schema.
 *
 * @type {Object}
 */

const marks = MARK_TAGS.reduce((acc, tag) => {
  acc[tag.type] = tag.render;
  return acc;
}, {});

export const schema = {
  marks
};
