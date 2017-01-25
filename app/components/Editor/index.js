/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
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
    transform: (transform) => {
      return transform
        .setBlock({ type: 'hr', isVoid: true })
        .collapseToStartOfNextBlock();
    }
  })
];

const schema = {
  nodes: {
    hr: (props) => {
      const { node, state } = props;
      const isFocused = state.selection.hasEdgeIn(node);
      const style = isFocused ? { border: '1px solid blue' } : {};
      return <hr {...props.attributes} style={style} />;
    }
  }
};

class CustomEditor extends Component {
  state = {
    editorState: Raw.deserialize(initialState, { terse: true })
  };

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  }

  insertParagraph = (state) => {
    return state
      .transform()
      .splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {}
      })
      .extendForward(1)
      .delete()
      .apply({
        save: false
      });
  }

  onDocumentChange = (document, state) => {
    if (!state.isCollapsed) return;
    const block = state.startBlock;
    if (!block.isVoid) return;
    const transformed = this.insertParagraph(state);
    this.onChange(transformed);
  }

  insertBlock = (properties) => {
    console.log('insert', properties);
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
        { /* It is important that toolbar renders after editor because position calculation */ }
        <Toolbar
          editorState={editorState}
          insertBlock={this.insertBlock}
        />
      </div>
    );
  }

}

export default CustomEditor;
