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
  | 'heading-one'
  | 'heading-two'
  | 'image'
  | 'separator'
  | 'todo'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item';

const deserialize = (tagName, type, kind) => (el, next) => {
  if (el.tagName.toLowerCase() === tagName) {
    return {
      kind,
      type,
      nodes: next(el.childNodes)
    };
  }
};

const serialize = (type, kind: TagKind, serializer) => (object, children) => {
  if (object.kind === kind && object.type === type) {
    return serializer({ object, children });
  }
};

const genericRender = tagName => ({ children, attributes }) =>
  React.createElement(tagName, attributes, children);

const createMarkTag = (type, icon, tagName, style) => ({
  type,
  icon,
  tag: tagName,
  style,
  deserialize: deserialize(tagName, type, 'mark'),
  serialize: serialize(type, 'mark', genericRender(tagName))
});

export const MARK_TAGS = [
  createMarkTag('italic', 'italic', 'em', { fontStyle: 'italic' }),
  createMarkTag('bold', 'bold', 'strong', { fontWeight: 'bold' }),
  createMarkTag('underline', 'underline', 'u', { textDecoration: 'underline' }),
  createMarkTag('code', 'code', 'code', {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: '3px',
    borderRadius: '4px'
  }),
  /*createMarkTag('link', 'link', 'a', {
    textDecoration: 'underline',
    color: 'blue'
  }),*/
  createMarkTag('strikethrough', 'strikethrough', 'strike', {
    textDecoration: 'line-through'
  })
];

/*/**
 * Block tags
 *
 * @type {Object}
 */
export const BLOCK_TAGS = [
  {
    type: 'block-quote',
    icon: 'quote-left',
    render: ({ children }) => <blockquote> {children} </blockquote>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'block-quote') {
        return <blockquote> {children} </blockquote>;
      }
    }
  },
  {
    type: 'paragraph',
    hoverHidden: true,
    render: ({ children }) => <p> {children} </p>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'paragraph') {
        return <p> {children} </p>;
      }
    }
  },
  {
    type: 'heading-one',
    icon: 'header',
    render: ({ children }) => <h1> {children} </h1>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'heading-one') {
        return <h1> {children} </h1>;
      }
    }
  },
  {
    type: 'heading-two',
    icon: 'font',
    render: ({ children }) => <h2> {children} </h2>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'heading-two') {
        return <h2> {children} </h2>;
      }
    }
  },
  {
    type: 'image',
    icon: 'image',
    hoverHidden: true,
    render: ({ children }) => <img />,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'image') {
        return <img src="https://abakus.no/static/gfx/favicon.png" />;
      }
    }
  },
  {
    type: 'separator',
    icon: 'minus',
    hoverHidden: true,
    render: ({ children }) => <hr />,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'separator') {
        return <hr />;
      }
    }
  },
  {
    type: 'numbered-list',
    icon: 'list-ol',
    render: ({ children }) => <ol> {children} </ol>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'numbered-list') {
        return <ol> {children} </ol>;
      }
    }
  },
  {
    type: 'bulleted-list',
    icon: 'list-ul',
    render: ({ children }) => <ul> {children} </ul>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'bulleted-list') {
        return <ul> {children} </ul>;
      }
    }
  },
  {
    type: 'list-item',
    hoverHidden: true,
    render: ({ children }) => <li> {children} </li>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'list-item') {
        return <li> {children} </li>;
      }
    }
  }
];

/**
 * Define a schema.
 *
 * @type {Object}
 */

const marks = MARK_TAGS.reduce((acc, tag) => {
  acc[tag.type] = tag.style;
  return acc;
}, {});

const nodes = BLOCK_TAGS.reduce((acc, tag) => {
  acc[tag.type] = tag.render;
  return acc;
}, {});

export const schema = {
  marks,
  nodes
};
