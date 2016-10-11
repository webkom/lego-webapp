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

  onBlur = () => {
    this.setState({ active: false });
  }

  onFocus = () => {
    const selection = EditorState.moveSelectionToEnd(this.state.editorState);
    this.setState({ active: true });
    this.onChange(EditorState.forceSelection(selection, selection.getSelection()));
    return this.editorRoot.focus();
  }

  render() {
    const { editorState } = this.state;

    return (
      <div className={styles.editorRoot} onBlur={this.onBlur} id='editor'>

          <Editor
            ref={(node) => { this.editorRoot = node; }}
            editorState={editorState}
            placeholder={this.props.placeholder}
            onChange={(e) => this.onChange(e)}
            onFocus={this.onFocus}
          />

          <Toolbar
            editorState={editorState}
            editorRoot={this.editorRoot}
            active={this.state.active}
            onChange={(e) => this.onChange(e)}
          />

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
