// @flow

import { convertFromHTML } from 'draft-convert';
import { Inline, Block, Entity as EntityType } from 'medium-draft';

export const htmlToStyle = (nodeName: string, node: any, currentStyle: any) => {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(Inline.ITALIC);
    case 'strong':
      return currentStyle.add(Inline.BOLD);
    case 'strike':
      return currentStyle.add(Inline.STRIKETHROUGH);
    case 'u':
      return currentStyle.add(Inline.UNDERLINE);
    case 'span':
      if (node.className === `${Inline.HIGHLIGHT.toLowerCase()}`) {
        return currentStyle.add(Inline.HIGHLIGHT);
      }
      break;
    case 'code':
      return currentStyle.add(Inline.CODE);
    default:
      break;
  }

  return currentStyle;
};

export const htmlToEntity = (
  nodeName: string,
  node: any,
  createEntity: any
) => {
  if (nodeName === 'a') {
    return createEntity(EntityType.LINK, 'MUTABLE', { url: node.href });
  }
  return undefined;
};

export const htmlToBlock = (nodeName: string, node: any) => {
  if (nodeName === 'h1') {
    return {
      type: Block.H1,
      data: {}
    };
  } else if (nodeName === 'h2') {
    return {
      type: Block.H2,
      data: {}
    };
  } else if (nodeName === 'h3') {
    return {
      type: Block.H3,
      data: {}
    };
  } else if (nodeName === 'h4') {
    return {
      type: Block.H4,
      data: {}
    };
  } else if (nodeName === 'h5') {
    return {
      type: Block.H5,
      data: {}
    };
  } else if (nodeName === 'h6') {
    return {
      type: Block.H6,
      data: {}
    };
  } else if (
    nodeName === 'p' &&
    (node.className === Block.CAPTION.toLowerCase() ||
      node.className === Block.BLOCKQUOTE_CAPTION.toLowerCase())
  ) {
    return {
      type: Block.BLOCKQUOTE_CAPTION,
      data: {}
    };
  } else if (nodeName === 'figure') {
    if (node.querySelector('img')) {
      const imageNode = node.querySelector('img');
      return {
        type: Block.IMAGE,
        data: {
          src: imageNode && imageNode.src,
          fileKey: imageNode && imageNode.getAttribute('data-file-key')
        }
      };
    } else if (node.className === Block.ATOMIC.toLowerCase()) {
      return {
        type: Block.ATOMIC,
        data: {}
      };
    }
    return undefined;
  } else if (nodeName === 'div' && node.getAttribute('data-type') === 'todo') {
    const inputNode = node.querySelector('input');
    return {
      type: Block.TODO,
      data: {
        checked: inputNode && inputNode.checked
      }
    };
  } else if (nodeName === 'hr') {
    return {
      type: Block.BREAK,
      data: {}
    };
  } else if (nodeName === 'blockquote') {
    return {
      type: Block.BLOCKQUOTE,
      data: {}
    };
  } else if (nodeName === 'p') {
    return {
      type: Block.UNSTYLED,
      data: {}
    };
  }

  return undefined;
};

export const options = {
  htmlToStyle,
  htmlToEntity,
  htmlToBlock
};

export default (rawHTML: any, htmlOptions: Object = options) => {
  if (__CLIENT__) {
    return convertFromHTML(htmlOptions)(rawHTML);
  }

  // This is slightly hacky, but allows us to server-side render the editor directly:
  const { JSDOM } = require('jsdom');
  const dom = html => {
    const fullHtml = `<!doctype html><html><body>${html}</body></html>`;
    const { window } = new JSDOM(fullHtml);
    return window.document;
  };

  return convertFromHTML(htmlOptions)(rawHTML, { flat: false }, dom);
};
