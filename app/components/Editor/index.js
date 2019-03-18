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

const plugins = [EditList()];

export default class Editor extends Component<Props, State> {
  state = {
    value: initialValue
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  onKeyDown = (e, editor, next) => {
    const { node } = this.props;
    if (node.type == 'paragraph') {
      switch (e.key) {
        case 'Enter': {
          e.preventDefault();
          editor.setBlocks('break');
          break;
        }
      }
    }
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
        editor.setBlocks('ol_list');
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
      default:
        return next();
    }
  };

  toolbarHandler = (e, type) => {};

  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <>
        <Toolbar editor={editor} />
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
