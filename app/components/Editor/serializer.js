import React from 'react';
import Html from 'slate-html-serializer';

const BLOCK_TAGS = {
  p: 'paragraph',
  h2: 'h2',
  h4: 'h4',
  ul: 'ul_list',
  ol: 'ol_list',
  li: 'list_item',
  pre: 'code-block',
  figure: 'figure',
  img: 'image',
  figcaption: 'image_caption'
};

const INLINE_TAGS = {
  a: 'link'
};

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
  code: 'code'
};

const rules = [
  // Blocks
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        switch (type) {
          case 'figure': {
            return {
              object: 'block',
              type: type,
              data: {},
              nodes: next(el.childNodes)
            };
          }
          case 'image': {
            return {
              object: 'block',
              type: type,
              data: {
                src: el.getAttribute('src'),
                fileKey: el.getAttribute('data-file-key')
              }
            };
          }
          case 'image_caption': {
            return {
              object: 'block',
              type: type,
              data: {},
              nodes: next(el.childNodes)
            };
          }
          default:
            return {
              object: 'block',
              type: type,
              data: {
                className: el.getAttribute('class')
              },
              nodes: next(el.childNodes)
            };
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p>{children}</p>;
          case 'h2':
            return <h2>{children}</h2>;
          case 'h4':
            return <h4>{children}</h4>;
          case 'ul_list':
            return <ul>{children}</ul>;

          case 'ol_list':
            return <ol>{children}</ol>;
          case 'list_item':
            return <li>{children}</li>;
          case 'code-block':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case 'figure':
            return <figure>{children}</figure>;
          case 'image':
            return (
              <img
                src={obj.data.get('src')}
                data-file-key={obj.data.get('fileKey')}
                alt="Placeholder"
              />
            );
          case 'image_caption':
            return <figcaption>{children}</figcaption>;
        }
      }
    }
  },
  // Inlines
  {
    deserialize(el, next) {
      const type = INLINE_TAGS[el.tagName.toLowerCase()];
      if (type) {
        if (type == 'link') {
          return {
            object: 'inline',
            type: type,
            data: {
              url: el.getAttribute('href')
            },
            nodes: next(el.childNodes)
          };
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'inline') {
        switch (obj.type) {
          case 'link':
            return (
              <a target="blank" href={obj.data.get('url')}>
                {children}
              </a>
            );
        }
      }
    }
  },
  // Marks
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'italic':
            return <em>{children}</em>;
          case 'bold':
            return <strong>{children}</strong>;
          case 'underline':
            return <u>{children}</u>;
          case 'code':
            return (
              <code
                style={{
                  backgroundColor: '#efefef',
                  padding: '2px 3px',
                  borderRadius: '2px'
                }}
              >
                {children}
              </code>
            );
        }
      }
    }
  }
];

export const html = new Html({ rules });
