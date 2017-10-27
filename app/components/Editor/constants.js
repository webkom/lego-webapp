/* eslint-disable react/display-name */
// @flow

import React, { type Node } from 'react';

type HasChildren = {
  children: Node
};

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
  | 'block-quote'
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

const deserialize = (tagName, type, kind) => (el: HTMLElement, next: any) => {
  if (el.tagName.toLowerCase() === tagName) {
    return {
      kind,
      type,
      nodes: next(el.childNodes)
    };
  }
};

const serialize = (type, kind: TagKind, serializer) => (
  object: Object,
  children: any
) => {
  if (object.kind === kind && object.type === type) {
    return serializer({ attributes: object, children });
  }
};

const genericRender = tagName => ({
  children,
  attributes
}: {
  children: Node,
  attributes: Object
}) => React.createElement(tagName, attributes, children);

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

type BlockTag = {
  type: string,
  icon: string,
  render: ({ children: Node }) => Node,
  serialize: (object: any, children: Node) => Node,
  hoverHidden?: boolean
};

/**
 * Block tags
 *
 * @type {Object}
 */

export const BLOCK_TAGS: Array<BlockTag> = ([
  {
    type: 'block-quote',
    icon: 'quote-left',
    render: ({ children }: HasChildren) => <blockquote>{children}</blockquote>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'block-quote') {
        return <blockquote>{children}</blockquote>;
      }
    }
  },
  {
    type: 'paragraph',
    hoverHidden: true,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'paragraph') {
        return <p>{children}</p>;
      }
    }
  },
  {
    type: 'heading-one',
    icon: 'header',
    render: ({ children }: HasChildren) => <h1>{children}</h1>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'heading-one') {
        return <h1>{children}</h1>;
      }
    }
  },
  {
    type: 'heading-two',
    icon: 'font',
    render: ({ children }: HasChildren) => <h2>{children}</h2>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'heading-two') {
        return <h2>{children}</h2>;
      }
    }
  },
  {
    type: 'image',
    icon: 'image',
    hoverHidden: true,
    render: ({ children }: HasChildren) => <img alt="" />,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'image') {
        return <img src="https://abakus.no/static/gfx/favicon.png" alt="" />;
      }
    }
  },
  {
    type: 'separator',
    icon: 'minus',
    hoverHidden: true,
    render: ({ children }: HasChildren) => <hr />,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'separator') {
        return <hr />;
      }
    }
  },
  {
    type: 'numbered-list',
    icon: 'list-ol',
    render: ({ children }: HasChildren) => <ol>{children}</ol>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'numbered-list') {
        return <ol>{children}</ol>;
      }
    }
  },
  {
    type: 'bulleted-list',
    icon: 'list-ul',
    render: ({ children }: HasChildren) => <ul>{children}</ul>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'bulleted-list') {
        return <ul>{children}</ul>;
      }
    }
  },
  {
    type: 'list-item',
    hoverHidden: true,
    render: ({ children }: HasChildren) => <li>{children}</li>,
    serialize: (object, children) => {
      if (object.kind === 'block' && object.type === 'list-item') {
        return <li>{children}</li>;
      }
    }
  }
]: any);

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
  if (tag.render) {
    acc[tag.type] = tag.render;
  }
  return acc;
}, {});

export const schema = {
  marks,
  nodes
};
