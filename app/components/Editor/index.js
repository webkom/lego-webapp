import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';
import Toolbar from './components/Toolbar';
import {
  BoldMark,
  ItalicMark,
  UnderlineMark,
  CodeMark,
  LinkMark
} from './components/marks';
import styles from './Editor.css';
import editList from './plugins/editList';
import NoEmpty from 'slate-no-empty';
import InsertImages from 'slate-drop-or-paste-images';
import ImageUpload from 'app/components/Upload/ImageUpload';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'This is a test of the slate editor'
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'ul_list',
        nodes: [
          {
            object: 'block',
            type: 'list_item',
            nodes: [
              {
                object: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        text: 'This is an unordered list'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'ol_list',
        nodes: [
          {
            object: 'block',
            type: 'list_item',
            nodes: [
              {
                object: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        text: 'This is an ordered list'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});

function insertTab(options) {
  return {
    onKeyDown(event, editor, next) {
      if (event.key == 'Tab') {
        event.preventDefault();
        editor.insertText('\t');
      } else return next();
    }
  };
}

function softEnter(types) {
  return {
    onKeyDown(event, editor, next) {
      if (!editor.value.blocks.some(block => types.includes(block.type))) {
        return next();
      }
      if (event.key == 'Enter') {
        // if user is holding shift, default behaviour, (new block)
        if (event.shiftKey) return next();
        event.preventDefault();
        editor.insertText('\n');
      } else return next();
    }
  };
}

function images() {
  return InsertImages({
    extensions: ['png', 'jpeg'],
    insertImage: (editor, file) => {
      return editor.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      });
    }
  });
}

const DEFAULT_BLOCK = 'paragraph';

const plugins = [
  editList(),
  insertTab(),
  softEnter(['code-block']),
  NoEmpty(),
  images()
];

export default class Editor extends Component<Props, State> {
  state = {
    value: initialValue,
    showUpload: false,
    image: null
  };

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  hasBlock = type => {
    const { value } = this.editor;
    return value.blocks.some(node => node.type == type);
  };

  toggleBlock = (e, type) => {
    e.preventDefault();
    const editor = this.editor;
    const { value } = editor;
    const { document } = value;

    const isType = value.blocks.some(block => {
      return !!document.getClosest(block.key, parent => parent.type === type);
    });

    if (type !== 'ul_list' && type !== 'ol_list') {
      const isActive = this.hasBlock(type);
      isActive ? editor.setBlocks(DEFAULT_BLOCK) : editor.setBlocks(type);
    } else {
      const isList = value.blocks.some(
        block =>
          !!document.getClosest(block.key, node => node.type === 'list_item')
      );

      const closest = document.getClosest(
        editor.value.startBlock.key,
        a => a.type == 'ol_list' || a.type == 'ul_list'
      );

      const isType = closest && closest.type === type;

      if (isType && isList) {
        editor
          .unwrapBlock('list_item')
          .unwrapBlock('ul_list')
          .unwrapBlock('ol_list');
      } else if (isList) {
        editor
          .unwrapBlock('list_item')
          .unwrapBlock(type == 'ol_list' ? 'ul_list' : 'ol_list')
          .wrapBlock(type)
          .wrapBlock('list_item')
          .mergeNodeByKey();
      } else {
        editor
          .wrapBlock(type)
          .wrapBlock('list_item')
          .setBlocks(DEFAULT_BLOCK);
      }
    }
  };

  onKeyDown = (e, editor, next) => {
    if (!e.ctrlKey) return next();

    switch (e.key) {
      case 'b': {
        e.preventDefault();
        editor.toggleMark('bold');
        break;
      }
      case 'i': {
        e.preventDefault();
        editor.toggleMark('italic');
        break;
      }
      case 'l': {
        e.preventDefault();
        editor.setBlocks('ul_list');
        break;
      }
      default: {
        return next();
      }
    }
  };

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <BoldMark {...props} />;
      case 'italic':
        return <ItalicMark {...props} />;
      case 'underline':
        return <UnderlineMark {...props} />;
      case 'code':
        return <CodeMark {...props} />;
      case 'link':
        return <LinkMark {...props} />;
      default:
        return next();
    }
  };

  renderNode = (props, editor, next) => {
    const { attributes, node, children } = props;
    switch (node.type) {
      case 'paragraph':
        return (
          <p className={styles.paragraph} {...attributes}>
            {children}
          </p>
        );
      case 'ul_list':
        return (
          <ul className={styles.ul_list} {...attributes}>
            {children}
          </ul>
        );
      case 'ol_list':
        return (
          <ol className={styles.ol_list} {...attributes}>
            {children}
          </ol>
        );
      case 'list_item':
        return (
          <li className={styles.li} {...attributes}>
            {children}
          </li>
        );
      case 'code-block':
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      case 'image':
        return (
          <img
            src={attributes.data.file}
            alt="Bildet kunne ikke vises"
            {...attributes}
          />
        );
      default:
        return next();
    }
  };

  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <>
        {this.state.showUpload && (
          <ImageUpload
            onSubmit={this.submitImage}
            isModal
            crop
            img={this.state.image}
          />
        )}
        <Toolbar editor={editor} toggleBlock={this.toggleBlock} />
        {children}
      </>
    );
  };

  render() {
    return (
      <div className={styles.root}>
        <SlateEditor
          renderEditor={this.renderEditor}
          value={this.state.value}
          ref={this.ref}
          plugins={plugins}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}
