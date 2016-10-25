import { convertToHTML } from 'draft-convert';

export const toHTML = (content) => convertToHTML({
  blockToHTML: {
    'unstyled': {
      start: '<p>',
      end: '</p>',
      empty: '<br>'
    },
    'atomic:break': {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    },
    'atomic:embed': {
      start: '<p>',
      end: '</p>',
      empty: '<div><hr></div>'
    }
  },
  styleToHTML: {
    STRIKETHROUGH: {
      start: '<span style="text-decoration: line-through;">',
      end: '</span>'
    },
    HIGHLIGHT: {
      start: '<mark>',
      end: '</mark>'
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'mention') {
      return `<a class="mention"
        data-username="${entity.data.mention.get('username')}"
        href="${entity.data.mention.get('link')}"
        >${originalText}</a>`;
    }
    return originalText;
  }
})(content);
