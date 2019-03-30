import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value, Block } from 'slate';
import Toolbar from './components/Toolbar';
import {
  BoldMark,
  ItalicMark,
  UnderlineMark,
  CodeMark
} from './components/marks';
import ImageBlock from './components/blocks';
import MazeMap from './components/MazeMap';
import styles from './Editor.css';
import editList from './plugins/editList';
import pasteLink from './plugins/pasteLink';
import NoEmpty from 'slate-no-empty';
import { html } from './serializer';

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

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph');
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

// Simply enables the user to insert tabs when editing
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

/*  softEnter(Array<string>) => onKeyDown()
 *  A plugin that enables soft enter if selection has blocks
 *  of a type specified. Takes an array of types as its only argument
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

function images() {
  return {
    commands: {
      insertImage(editor, file) {
        const imageUrl = URL.createObjectURL(file);
        editor.insertBlock({ data: { file, imageUrl }, type: 'image' });
      }
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
  NoEmpty(),
  linkCommands,
  pasteLink(),
  images()
];

export default class Editor extends Component<Props, State> {
  state = {
    editorValue: this.props.value
      ? html.deserialize(this.props.value)
      : initialValue,
    value: this.props.value,
    showUpload: false,
    image: null
  };

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ editorValue: value });
    this.props.onChange(html.serialize(value));
  };

  hasBlock = type => {
    const { value } = this.editor;
    return value.blocks.some(node => node.type == type);
  };

  toggleBlock = (e, type) => {
    e.preventDefault();
    const editor = this.editor;

    if (type !== 'ul_list' && type !== 'ol_list') {
      const isActive = this.hasBlock(type);
      isActive ? editor.setBlocks(DEFAULT_BLOCK) : editor.setBlocks(type);
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
        return <h2 {...attributes}>{children}</h2>;
      case 'h4':
        return <h4 {...attributes}>{children}</h4>;
      case 'link':
        return (
          <a {...attributes} href={node.data.url}>
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
            attributes={attributes}
          />
        );
      }
      case 'mazeMap': {
        return <MazeMap {...attributes} />;
      }
      default:
        return next();
    }
  };

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

  // Calling onBlur and onFocus methods passed down
  // via props to make the editor work with redux-form
  onFocus = (event, editor, next) => {
    event.preventDefault();
    this.props.onFocus();
  };

  onBlur = (event, editor, next) => {
    event.preventDefault();
    this.props.onBlur();
  };

  render() {
    return (
      <div
        onFocus={this.onFocus}
        className={
          this.props.disabled || this.props.simple
            ? styles.disabled
            : styles.root
        }
      >
        <SlateEditor
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
