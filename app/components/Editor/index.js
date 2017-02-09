/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
import { Blocks } from './constants';
import { Break, Image } from './Blocks';
import AutoReplaceText from 'slate-auto-replace-text';
import AutoReplace from 'slate-auto-replace';
import Toolbar from './Toolbar';
import initialState from './initialState.json';

const plugins = [
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

  onChange = (editorState) => {
    this.setState({ editorState });
  }

  insertParagraph = (state) => state
      .transform()
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
      })

  onDocumentChange = (document, state) => {
    if (!state.isCollapsed) {
      return;
    }

    const block = state.startBlock;

    if (!block.isVoid) {
      return;
    }

    const transformed = this.insertParagraph(state);

    this.onChange(transformed);
  }

  insertBlock = (properties) => {
    const transformed = this.insertParagraph(
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
      <div>
        <Editor
          state={editorState}
          onChange={this.onChange}
          plugins={plugins}
          schema={schema}
          onDocumentChange={this.onDocumentChange}
        />

        <Toolbar
          uploadFile={this.props.uploadFile}
          editorState={editorState}
          insertBlock={this.insertBlock}
        />

      </div>
    );
  }

}
