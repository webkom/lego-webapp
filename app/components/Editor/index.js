import React from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value, Block, Text } from 'slate';
import isUrl from 'is-url';
import isHotKey from 'is-hotkey';
import Toolbar from './components/Toolbar';
import * as slateTypes from 'slate';
import {
  BoldMark,
  ItalicMark,
  UnderlineMark,
  CodeMark
} from './components/marks';
import { List } from 'immutable';
import styles from './Editor.css';
import editList from './plugins/editList';
import pasteLink from './plugins/pasteLink';
import images from './plugins/images';
import MarkdownShortcuts from './plugins/markdown';
import { html } from './serializer';
import schema from './schema';

//Not really needed since the schema owerwrites this.
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: []
          }
        ]
      }
    ]
  }
});

// Simply enables the user to insert tabs when editing
// TODO switch tabs for spaces in code blocks, make backspace remove two spaces
function insertTab(options) {
  return {
    onKeyDown(event: React.KeyboardEvent<any>, editor, next) {
      if (event.key == 'Tab') {
        event.preventDefault();
        editor.insertText('\t');
      } else return next();
    }
  };
}

/*  softEnter(Array<string>) => onKeyDown()
 *  A plugin that enables soft enter if selection has blocks
 *  of a type specified. Takes an array of types as its only argument
 *  TODO consider adding soft enter on shift for paragraphs and removing the need for shift+enter in
 *  lists
 */

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

// A set of commands and queries to edit links
const linkCommands = {
  commands: {
    wrapLink(editor, url) {
      editor.wrapInline({ data: { url: url, text: url }, type: 'link' });
    },
    unwrapLink(editor) {
      editor.unwrapInline('link');
    }
  },
  queries: {
    isLinkActive(editor) {
      editor.value.inlines.some(inline => inline.type == 'link');
    }
  }
};

const DEFAULT_BLOCK = 'paragraph';

const plugins = [
  editList(),
  insertTab(),
  softEnter(['code-block']),
  linkCommands,
  pasteLink(),
  images(),
  MarkdownShortcuts
];

export default class Editor extends React.Component<Props, State> {
  state = {
    editorValue: this.props.value
      ? html.deserialize(this.props.value)
      : initialValue,
    value: this.props.value
  };

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ editorValue: value });
    this.props.onChange(html.serialize(value));
  };

  // returns true if there exists a block of type 'type' in the current selection
  hasBlock = type => {
    const { value } = this.editor;
    return value.blocks.some(node => node.type == type);
  };

  // Toggles the block type of everything except lists
  toggleBlock = (e, type) => {
    e.preventDefault();
    const editor = this.editor;

    if (type !== 'ul_list' && type !== 'ol_list') {
      const isActive = this.hasBlock(type);
      isActive ? editor.setBlocks(DEFAULT_BLOCK) : editor.setBlocks(type);
    }
  };

  onKeyDown = (e, editor, next) => {
    if (!isHotKey('mod')(e)) return next();

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
        editor.setListType('ul_list');
        break;
      }
      case 'z': {
        e.preventDefault();
        editor.undo();
        break;
      }
      case 'r': {
        e.preventDefault();
        editor.redo();
        break;
      }
      default: {
        return next();
      }
    }
  };

  // Components to be rendered for mark nodes
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
      default:
        return next();
    }
  };

  // Components te be rendered for block and inline nodes
  renderNode = (props, editor, next) => {
    const { attributes, node, children, isFocused } = props;
    switch (node.type) {
      case 'paragraph':
        return (
          <p className={styles.paragraph} {...attributes}>
            {children}
          </p>
        );
      case 'h1':
        return <h1 {...attributes}>{children}</h1>;
      case 'h2':
        return <h2 {...attributes}>{children}</h2>;
      case 'h3':
        return <h3 {...attributes}>{children}</h3>;
      case 'h4':
        return <h4 {...attributes}>{children}</h4>;
      case 'h5':
        return <h5 {...attributes}>{children}</h5>;
      case 'link':
        return (
          <a {...attributes} target="blank" href={node.data.get('url')}>
            {children}
          </a>
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
      default:
        return next();
    }
  };

  // Render function for how the editor should render
  // practical for passing props and the 'editor' prop to other components
  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <>
        {!this.props.disabled && !this.props.simple && (
          <Toolbar editor={editor} toggleBlock={this.toggleBlock} />
        )}
        {children}
      </>
    );
  };

  // Calling onBlur and onFocus methods passed down (optional)
  // via props to make the editor work with redux-form, (or any other handlers)
  // These methods need to by async because slates event handlers need to be called
  // before redux-forms handlers.
  async onFocus(event, editor, next) {
    event.preventDefault();
    await next();
    if (this.props.onFocus) await this.props.onFocus();
  }

  async onBlur(event, editor, next) {
    event.preventDefault();
    await next();
    if (this.props.onBlur) await this.props.onBlur();
  }

  render() {
    return (
      <div
        className={
          this.props.disabled || this.props.simple
            ? styles.disabled
            : styles.root
        }
      >
        <SlateEditor
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          autoFocus={this.props.autoFocus}
          renderEditor={this.renderEditor}
          value={this.state.editorValue}
          ref={this.ref}
          plugins={plugins}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          schema={schema}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
          readOnly={this.props.disabled}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}
