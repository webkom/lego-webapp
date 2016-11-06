import { convertToHTML } from 'draft-convert';
import { Block, Inline } from './constants';

export const toHTML = (content) => convertToHTML({
  blockToHTML: {
    [Block.UNSTYLED]: {
      start: '<p>',
      end: '</p>',
      empty: '<br>'
    },
    [Block.BREAK]: {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    },
    [Block.EMBED]: {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    }
  },
  styleToHTML: {
    [Inline.STRIKETHROUGH]: {
      start: '<span style="text-decoration: line-through;">',
      end: '</span>'
    },
    [Inline.HIGHLIGHT]: {
      start: '<mark>',
      end: '</mark>'
    }
  },
  entityToHTML: (entity, originalText) => {
    console.log(entity);
    if (entity.type === 'mention') {
      return `<a class="mention"
        data-username="${entity.data.mention.get('username')}"
        href="${entity.data.mention.get('link')}"
        >${originalText}</a>`;
    }

    if (entity.type === 'LINK') {
      return `<a href="${entity.data.url}">${originalText}</a>`;
    }

    return originalText;
  }
})(content);
