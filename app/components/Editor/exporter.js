// @flow

import React from 'react';
import { convertToHTML } from 'draft-convert';
import { Inline, Block, Entity } from 'medium-draft';

type EntityProps = {
  blockType: string,
  data: Object,
  text: string,
  extraClass: string,
};

type BlockProps = {
  blockType: string,
  data: Object,
  text: string,
  type: string,
  extraClass: string,
};

export const styleToHTML = (style: string) => {
  switch (style) {
    case Inline.ITALIC:
      return <em className={`${style.toLowerCase()}`} />;
    case Inline.BOLD:
      return <strong className={`${style.toLowerCase()}`} />;
    case Inline.STRIKETHROUGH:
      return <strike className={`${style.toLowerCase()}`} />;
    case Inline.UNDERLINE:
      return <u className={`${style.toLowerCase()}`} />;
    case Inline.HIGHLIGHT:
      return <span className={`${style.toLowerCase()}`} />;
    case Inline.CODE:
      return <code className={`${style.toLowerCase()}`} />;
    default:
      return null;
  }
};

export const blockToHTML = (block: BlockProps) => {
  const blockType = block.type;
  switch (blockType) {
    case Block.H1:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h1 className={`${blockType.toLowerCase()}`} />;
    case Block.H2:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 className={`${blockType.toLowerCase()}`} />;
    case Block.H3:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h3 className={`${blockType.toLowerCase()}`} />;
    case Block.H4:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h4 className={`${blockType.toLowerCase()}`} />;
    case Block.H5:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h5 className={`${blockType.toLowerCase()}`} />;
    case Block.H6:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h6 className={`${blockType.toLowerCase()}`} />;
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
      return {
        start: `<p class="${blockType.toLowerCase()}"><caption>`,
        end: '</caption></p>',
      };
    case Block.IMAGE: {
      const imgData = block.data;
      const text = block.text;
      const extraClass = text.length > 0 ? ' image-has-caption' : '';
      return {
        start: `<figure class="image${extraClass}"><img src="${
          imgData.src
        }" alt="${block.text}" /><figcaption className="image-caption">`,
        end: '</figcaption></figure>',
      };
    }
    case Block.ATOMIC:
      return {
        start: `<figure className="${blockType.toLowerCase()}">`,
        end: '</figure>',
      };
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = '';
      let containerClass = '';
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
        containerClass = 'todo-checked';
      } else {
        inp = '<input type=checkbox disabled />';
        containerClass = 'todo-unchecked';
      }
      return {
        start: `<div class="${blockType.toLowerCase()} ${containerClass}">${inp}<p>`,
        end: '</p></div>',
      };
    }
    case Block.BREAK:
      return <hr className={`${blockType.toLowerCase()}`} />;
    case Block.BLOCKQUOTE:
      return <blockquote className={`${blockType.toLowerCase()}`} />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol className={`${blockType.toLowerCase()}`} />,
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul className={`${blockType.toLowerCase()}`} />,
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return (
          <p className={`${blockType.toLowerCase()}`}>
            <br />
          </p>
        );
      }
      return <p className={`${blockType.toLowerCase()}`} />;
    default:
      return null;
  }
};

export const entityToHTML = (entity: EntityProps, originalText: string) => {
  if (entity.type === Entity.LINK) {
    return (
      <a
        className="link"
        href={entity.data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export default (contentState: any, htmlOptions: Object = options) =>
  convertToHTML(htmlOptions)(contentState);
