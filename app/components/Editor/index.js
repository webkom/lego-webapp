// @flow

import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { resetKeyGenerator } from 'slate';
import Html from 'slate-html-serializer';
import { schema } from './constants';
import HoverMenu from './HoverMenu';
import isHotkey from 'is-hotkey';
import rules from './serializer';
import styles from './Editor.css';
import type { BlockType, MarkType } from './constants';

const parseHtml =
  typeof DOMParser === 'undefined' && require('parse5').parseFragment;

const htmlArgs = { rules, parseHtml: parseHtml ? parseHtml : undefined };

const serializer = new Html(htmlArgs);
const isBoldHotkey = isHotkey('mod+b');
const isItalicHotkey = isHotkey('mod+i');
const isUnderlinedHotkey = isHotkey('mod+u');
const isCodeHotkey = isHotkey('mod+`');

type Document = {
  getClosest: (string, (Object) => boolean) => void
};

type EditorState = {
  document: Document,
  change: () => Change,
  blocks: [],
  startBlock: Object,
  startOffset: number,
  endOffset: number
};

type Change = {
  state: EditorState,
  toggleMark: MarkType => Change,
  setBlock: BlockType => Change,
  unwrapBlock: BlockType => Change,
  wrapBlock: BlockType => Change,
  splitBlock: () => Change,
  extendToStartOf: Object => Object
};

type Props = {
  value?: string,
  placeholder?: string,
  onChange: string => void,
  onBlur?: () => void,
  autoFocus?: boolean,
  readOnly?: boolean,
  onChange?: any,
  onFocus?: () => void
};

type State = {
  menu?: HTMLElement,
  state: EditorState
};

const emptyState = '<p></p>';

class CustomEditor extends Component<Props, State> {
  lastSerialized: string = '';

  constructor(props: Props) {
    super(props);
    resetKeyGenerator();
    const content = this.props.value || emptyState;

    this.state = {
      state: serializer.deserialize(content)
    };
  }

  componentWillReceiveProps = (newProps: Props) => {
    if (newProps.value !== this.lastSerialized) {
      const content = newProps.value || emptyState;
      this.setState({
        state: serializer.deserialize(content)
      });
    }
  };

  componentDidMount = () => {
    this.updateHoverMenu();
  };

  componentDidUpdate = () => {
    this.updateHoverMenu();
  };

  getType = (chars: string): ?BlockType => {
    switch (chars) {
      case '*':
      case '-':
      case '+':
        return 'list-item';
      case '>':
        return 'block-quote';
      case '#':
        return 'heading-one';
      case '##':
        return 'heading-two';
      default:
        return null;
    }
  };

  onChange = ({ state }: Change) => {
    if (state.document !== this.state.state.document) {
      this.lastSerialized = serializer.serialize(state);
      if (this.lastSerialized === emptyState) {
        this.lastSerialized = '';
      }
      this.props.onChange && this.props.onChange(this.lastSerialized);
    }

    this.setState({ state });
  };

  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  onKeyDown = (e: SyntheticInputEvent<*>, data: Object, change: Change) => {
    let mark: MarkType;

    if (data.key === 'space') {
      return this.onSpace(e, change);
    }

    if (data.key === 'backspace') {
      return this.onBackspace(e, change);
    }

    if (data.key === 'enter') {
      return this.onEnter(e, change);
    }

    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isItalicHotkey(e)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(e)) {
      mark = 'underline';
    } else if (isCodeHotkey(e)) {
      mark = 'code';
    } else {
      return;
    }

    e.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  onSpace = (e: SyntheticInputEvent<*>, change: Change) => {
    const { state }: any = change;
    if (state.isExpanded) return;

    const { startBlock, startOffset } = state;
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');
    const type = this.getType(chars);

    if (!type) return;
    if (type === 'list-item' && startBlock.type === 'list-item') return;
    e.preventDefault();

    change.setBlock(type);

    if (type === 'list-item') {
      change.wrapBlock('bulleted-list');
    }

    change.extendToStartOf(startBlock).delete();

    return true;
  };

  onBackspace = (e: SyntheticInputEvent<*>, change: Change) => {
    const { state } = change;
    if (state.isExpanded) return;
    if (state.startOffset !== 0) return;

    const { startBlock }: any = state;
    if (startBlock.type === 'paragraph') return;

    e.preventDefault();
    change.setBlock('paragraph');

    if (startBlock.type === 'list-item') {
      change.unwrapBlock('bulleted-list');
    }

    return true;
  };

  onEnter = (e: SyntheticInputEvent<*>, change: Change) => {
    const { state } = change;
    if (state.isExpanded) return;

    const { startBlock, startOffset, endOffset } = state;
    if (startOffset === 0 && startBlock.text.length === 0)
      return this.onBackspace(e, change);
    if (endOffset !== startBlock.text.length) return;

    if (
      startBlock.type !== 'heading-one' &&
      startBlock.type !== 'heading-two' &&
      startBlock.type !== 'block-quote'
    ) {
      return;
    }

    e.preventDefault();

    change.splitBlock().setBlock('paragraph');

    return true;
  };

  onToggleMark = (e: SyntheticInputEvent<*>, type: MarkType) => {
    e.preventDefault();
    const change = this.state.state.change().toggleMark(type);
    this.onChange(change);
  };

  onToggleBlock = (e: SyntheticInputEvent<*>, type: BlockType) => {
    e.preventDefault();
    const { state } = this.state;
    const change = state.change();
    const { document } = state;

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        change
          .setBlock(isActive ? 'paragraph' : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        change.setBlock(isActive ? 'paragraph' : type);
      }
    } else {
      const isList = this.hasBlock('list-item');
      const isType = state.blocks.some(
        block =>
          !!document.getClosest(block.key, parent => parent.type === type)
      );

      if (isList && isType) {
        change
          .setBlock('paragraph')
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        change.setBlock('list-item').wrapBlock(type);
      }
    }
    this.onChange(change);
  };

  hasBlock = (type: BlockType) => {
    const { state } = this.state;
    return state.blocks.some(node => node.type === type);
  };

  onOpenHoverMenu = (portal: HTMLElement) => {
    // $FlowFixMe firstChild dom Node?
    this.setState({ menu: portal.firstChild });
  };

  updateHoverMenu = () => {
    const { menu, state } = this.state;
    if (!menu) return;

    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style');
      return;
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = '1';
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left +
      window.scrollX -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  };

  render() {
    return (
      <div>
        <div className={styles.editor}>
          <HoverMenu
            onOpen={this.onOpenHoverMenu}
            state={this.state.state}
            onToggleBlock={this.onToggleBlock}
            onToggleMark={this.onToggleMark}
          />
          <Editor
            autoFocus={this.props.autoFocus}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            schema={schema}
            placeholder={this.props.placeholder || 'Enter some rich text...'}
            state={this.state.state}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            readOnly={this.props.readOnly}
          />
        </div>
      </div>
    );
  }
}

export default CustomEditor;
