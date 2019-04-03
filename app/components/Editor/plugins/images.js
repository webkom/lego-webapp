import React from 'react';
import ImageBlock from '../components/ImageBlock';
import { Block } from 'slate';
import { List } from 'immutable';
import styles from '../Editor.css';

// plugin to insert images: Creates an imageBlock from a file blob
// and creates a URL to the file for local storage
// TODO consider only uploading after submit
export default function images(options) {
  return {
    renderNode(props, editor, next) {
      const { attributes, node, children, isFocused } = props;
      switch (node.type) {
        case 'figure': {
          return (
            <figure className={styles.figure} {...attributes}>
              {children}
            </figure>
          );
        }
        case 'image': {
          return (
            <ImageBlock
              editor={editor}
              node={node}
              imageUrl={node.data.get('imageUrl')}
              src={node.data.get('src')}
              file={node.data.get('file')}
              isFocused={isFocused}
              {...attributes}
            />
          );
        }
        case 'image_caption': {
          return (
            <figcaption className={styles.figcaption} {...attributes}>
              {children}
            </figcaption>
          );
        }
        default:
          return next();
      }
    },
    commands: {
      insertImage(editor, file) {
        const imageUrl = URL.createObjectURL(file);
        const imageBlock = Block.create({
          data: { file, imageUrl },
          type: 'image'
        });
        editor.insertBlock({ data: { file, imageUrl }, type: 'image' });
      }
    }
  };
}
