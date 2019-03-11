import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';
import EditList from '@guestbell/slate-edit-list';
import { Toolbar } from './components/Toolbar';
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
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        editor.insertText('\t');
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
        editor.toggleMark('ol_list');
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
      case 'ul_list':
        return <ul {...attributes}>{children}</ul>;
      case 'ol_list':
        return (
          <ol className={styles.olList} {...attributes}>
            {children}
          </ol>
        );
      case 'list_item':
        return (
          <li className={styles.listItem} {...attributes}>
            {children}
          </li>
        );
      default:
        return next();
    }
  };

  toolbarHandler = (e, type) => {
    e.preventDefault();

    const { editor } = this.props;

    editor.toggleMark(type);
  };

  render() {
    return (
      <div>
        <Toolbar handler={this.toolbarHandler} />
        <SlateEditor
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          plugins={plugins}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}
