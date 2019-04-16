

import React from 'react';
import { convertToHTML } from 'draft-convert';
import { Inline, Block, Entity } from 'medium-draft';

type EntityProps = {
  blockType: string,
  data: Object,
  text: string,
  extraClass: string,
  type: string
};

type BlockProps = {
  blockType: string,
  data: Object,
  text: string,
  type: string,
  extraClass: string
};

export const styleToHTML = (style: string) => {
  switch (style) {
    case Inline.ITALIC:
      return <em />;
    case Inline.BOLD:
      return <strong />;
    case Inline.STRIKETHROUGH:
      return <strike />;
    case Inline.UNDERLINE:
      return <u />;
    case Inline.HIGHLIGHT:
      return <span />;
    case Inline.CODE:
      return <code />;
    default:
      return null;
  }
};

export const blockToHTML = (block: BlockProps) => {
  const blockType = block.type;
  switch (blockType) {
    case Block.H1:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h1 />;
    case Block.H2:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 />;
    case Block.H3:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h3 />;
    case Block.H4:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h4 />;
    case Block.H5:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h5 />;
    case Block.H6:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h6 />;
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
      return {
        start: '<p><caption>',
        end: '</caption></p>'
      };
    case Block.IMAGE: {
      const imgData = block.data;
      const text = block.text;
      return {
        start: `<figure data-type="${
          text.length > 0 ? 'image-with-caption' : 'image'
        }"><img src="${imgData.src}" data-file-key="${imgData.fileKey}" alt="${
          block.text
        }" /><figcaption>`,
        end: '</figcaption></figure>'
      };
    }
    case Block.ATOMIC:
      return {
        start: '<figure>',
        end: '</figure>'
      };
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = '';
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
      } else {
        inp = '<input type=checkbox disabled />';
      }
      return {
        start: `<div data-type="todo">${inp}<p>`,
        end: '</p></div>'
      };
    }
    case Block.BREAK:
      return <hr />;
    case Block.BLOCKQUOTE:
      return <blockquote />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol />
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul />
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return (
          <p className={blockType.toLowerCase()}>
            <br />
          </p>
        );
      }
      return <p />;
    default:
      return null;
  }
};

export const entityToHTML = (entity: EntityProps, originalText: string) => {
  if (entity.type === Entity.LINK) {
    return (
      <a href={entity.data.url} target="_blank" rel="noopener noreferrer">
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML
};

export default (contentState: any, htmlOptions: Object = options) =>
  convertToHTML(htmlOptions)(contentState);
