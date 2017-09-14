/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable jsx-a11y/img-has-alt */

import { Blocks, Inline } from './constants';

import React from 'react';

const BLOCK_TAGS = {
  img: Blocks.Image,
  blockquote: Blocks.Blockquote,
  cite: Blocks.Cite,
  br: Blocks.Paragraph,
  p: Blocks.Paragraph,
  h1: Blocks.H1,
  h2: Blocks.H2,
  ol: Blocks.OL,
  ul: Blocks.UL,
  li: Blocks.LI,
  hr: Blocks.Break
};

const getBlockType = el => {
  const type = BLOCK_TAGS[el.tagName];
  if (type) {
    return type;
  }
  if (el.tagName === 'div' && el.attribs['data-block-type']) {
    switch (el.attribs['data-block-type']) {
      case 'image':
        return Blocks.Image;
    }
  }
};

const isVoid = type => {
  if (type === Blocks.Image || type === Blocks.Break) {
    return true;
  }
  return false;
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: Inline.Italic,
  strong: Inline.Bold,
  u: Inline.Underline,
  strike: Inline.Striketrough,
  code: Inline.Code
};

export default [
  {
    deserialize(el, next) {
      const type = getBlockType(el);
      if (!type) return;

      const children = isVoid(type) ? null : next(el.children);

      if (type === Blocks.Image) {
        el = el.children[0];
        return {
          kind: 'block',
          type,
          isVoid: true,
          nodes: children,
          data: {
            src: el.attribs.src,
            fileKey: el.attribs['data-file-key']
          }
        };
      }

      return {
        kind: 'block',
        type,
        nodes: children
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      const data = object.data.toJS();
      switch (object.type) {
        case Blocks.Image:
          return (
            <div data-block-type="image" data-block-layout={data.blockLayout}>
              <img data-file-key={data.fileKey} src={data.src} />
            </div>
          );
        case Blocks.Break:
          return <hr />;
        case Blocks.Paragraph:
          return object.text !== '' ? <p>{children}</p> : <br />;
        case Blocks.Blockquote:
          return <blockquote>{children}</blockquote>;
        case Blocks.Cite:
          return <cite>{children}</cite>;
        case Blocks.H1:
          return <h1>{children}</h1>;
        case Blocks.H2:
          return <h2>{children}</h2>;
        case Blocks.OL:
          return <ol>{children}</ol>;
        case Blocks.UL:
          return <ul>{children}</ul>;
        case Blocks.LI:
          return <li>{children}</li>;
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
        case Inline.Bold:
          return <strong>{children}</strong>;
        case Inline.Code:
          return <code>{children}</code>;
        case Inline.Italic:
          return <em>{children}</em>;
        case Inline.Underline:
          return <u>{children}</u>;
        case Inline.Striketrough:
          return <strike>{children}</strike>;
      }
    }
  }
];
