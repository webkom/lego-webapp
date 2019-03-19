import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';
import EditList from '@guestbell/slate-edit-list';
import SoftBreak from 'slate-soft-break';
import Toolbar from './components/Toolbar';
import { BoldMark, ItalicMark } from './components/marks';
import styles from './Editor.css';

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
      }
    ]
  }
});

//function EditList(options) {
//return [
//onKeyDown(event, editor, next) {
//const closestBlock =
//}
//]
//}

const DEFAULT_BLOCK = 'paragraph';

const plugins = [EditList()];

export default class Editor extends Component<Props, State> {
  state = {
    value: initialValue
  };

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  toggleBlock = (e, type) => {
    e.preventDefault();
    const editor = this.editor;
    const { value } = editor;
    const { document } = value;

    const isType = value.blocks.some(block => {
      return !!document.getClosest(block.key);
    });

    if (type !== 'ul_list' && type !== 'ol_list') {
      const isActive = this.hasBlock(type);
      isActive ? editor.setBlocks(DEFAULT_BLOCK) : editor.setBlocks(type);
    } else {
      const isList = this.hasBlock('ol_list') || this.hasBlock('ul_list');
      if (isType && isList) {
        editor
          .setBlocks(DEFAULT_BLOCK)
          .unwrapBlock('ul_list')
          .unwrapBlock('ol_list');
      } else if (isList) {
        editor
          .unwrapBlock(type === 'ul_list' ? 'ol_list' : 'ul_list')
          .wrapBlock(type);
      } else {
        editor.setBlocks(type);
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
      case 'code':
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      default:
        return next();
    }
  };

  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <>
        <Toolbar editor={editor} toggleBlock={this.toggleBlock} />
        {children}
      </>
    );
  };

  render() {
    return (
      <div>
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
