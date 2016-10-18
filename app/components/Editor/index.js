import React, { Component } from 'react';
import { Editor, RichUtils, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import Tooltip from './Tooltip';
import Toolbar from './Toolbar';
import styles from './Editor.css';

export type Props = {
  content: string,
  placeholder?: string,
  onChange: () => void
};

export default class EditorComponent extends Component {

  props: Props;

  state = {
    editorState: EditorState.createEmpty(),
    active: false
  }

  onChange = (editorState) => {
    this.setState(
      { editorState },
      () => this.props.onChange(stateToHTML(this.state.editorState.getCurrentContent()))
    );
  }

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  onBlur = (e) => {
    console.log('blur', e);
    this.setState({ active: false });
  }

  onFocus = (e) => {
    this.setState({ active: true });
    const selection = EditorState.moveSelectionToEnd(this.state.editorState);
    this.onChange(EditorState.forceSelection(selection, selection.getSelection()));
    return this.editorRoot.focus();
  }

  render() {
    const { editorState } = this.state;
    const currentBlockKey = editorState.getSelection().getAnchorKey();
    const blockLength = editorState.getCurrentContent().getBlockForKey(currentBlockKey).getLength();

    return (
      <div className={styles.editorRoot} id='editor'>

          <Editor
            onBlur={this.onBlur}
            ref={(node) => { this.editorRoot = node; }}
            editorState={editorState}
            placeholder={this.props.placeholder}
            onChange={(e) => this.onChange(e)}
            onFocus={this.onFocus}
          />

          {blockLength === 0 && this.state.active ?
            <Toolbar
              editorState={editorState}
              editorRoot={this.editorRoot}
              active={this.state.active}
              onChange={(e) => this.onChange(e)}
            /> : null
          }

          {!editorState.getSelection().isCollapsed() && this.state.active ?
            <Tooltip
              editorState={editorState}
              editorRoot={this.editorRoot}
              toggleInlineStyle={this.toggleInlineStyle}
              toggleBlockType={this.toggleBlockType}
            /> : null
          }

      </div>
    );
  }
}
