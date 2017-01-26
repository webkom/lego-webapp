/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
import { Blocks } from './constants';
import { Break, Image } from './Blocks';
import AutoReplaceText from 'slate-auto-replace-text';
import AutoReplace from 'slate-auto-replace';
import Toolbar from './Toolbar';
import initialState from './initialState.json';
import styles from './Editor.css';

const insertParagraph = (state) => state
    .transform()
    .moveToOffsets(0, 0)
    .splitBlock()
    .setBlock({
      type: Blocks.Paragraph,
      isVoid: false,
      data: {}
    })
    .extendForward(1)
    .delete()
    .apply({
      save: false
    });

const enterOnVoidBlock = {
  onKeyDown(e, data, state) {
    if (e.keyCode === 13 && state.isCollapsed && state.startBlock.isVoid) {
      return insertParagraph(state);
    }
    return undefined;
  }
};

const plugins = [
  enterOnVoidBlock,
  AutoReplaceText('(c)', '©'),
  AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    after: /^$/,
    transform: (transform) => transform
        .setBlock({ type: Blocks.Break, isVoid: true })
        .collapseToStartOfNextBlock()
  })
];


const schema = {
  nodes: {
    [Blocks.Break]: Break,
    [Blocks.Image]: Image
  }
};

export default class CustomEditor extends Component {
  state = {
    editorState: Raw.deserialize(initialState, { terse: true })
  };

  wrapperElement = undefined;

  onChange = (editorState) => {
    this.setState({ editorState });
  }

  onDocumentChange = (document, state) => {
    if (!state.isCollapsed) {
      return;
    }

    const block = state.startBlock;

    if (!block.isVoid) {
      return;
    }

    const transformed = insertParagraph(state);

    this.onChange(transformed);
  }

  insertBlock = (properties) => {
    const transformed = insertParagraph(
      this.state.editorState
        .transform()
        .setBlock(properties)
        .collapseToStartOfNextBlock()
        .apply({
          save: false
        })
    );

    this.onChange(transformed);
  }

  render = () => {
    const { editorState } = this.state;

    return (
      <div
        ref={(c) => { this.wrapperElement = c; }}
        className={styles.EditorWrapper}
      >
        <Editor
          state={editorState}
          onChange={this.onChange}
          plugins={plugins}
          schema={schema}
          onDocumentChange={this.onDocumentChange}
          className={styles.Editor}
        />

        <Toolbar
          editorState={editorState}
          insertBlock={this.insertBlock}
          wrapperElement={this.wrapperElement}
        />

      </div>
    );
  }
}
