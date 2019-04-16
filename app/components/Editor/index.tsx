

import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import 'medium-draft/lib/index.css';
import {
  createEditorState,
  Editor as DraftEditor,
  rendererFn,
  Block,
  Inline,
  INLINE_BUTTONS,
  BLOCK_BUTTONS
} from 'medium-draft';
import importer from './importer';
import exporter from './exporter';
import { ImageButton, InfoButton } from './Sides';
import { ImageBlock } from './Blocks';
import './Editor.css';

type Props = {
  /** Set focus when component mounts */
  autoFocus?: boolean,
  /** The value in the editor */
  value?: string,
  /** Placeholder to be shown when no content */
  placeholder?: string,
  simple?: boolean,
  /** Disable editor input */
  disabled?: boolean,
  /** Function that returns the content as html when changed */
  onChange: string => void,
  /** Function that is called when editor is focused */
  onFocus: () => void,
  /** Function that is called when editor is blurred */
  onBlur: () => void
  /** Use editor in simple mode, just enable inline styling, no block styling */
};

type State = {
  editorState: any
};

/**
 * Custom Editor component
 *
 * ### Example Usage
 * ```js
 * <Editor />
 * ```
 *
 *  ### Also avialable as a redux form field
 * ```js
 * <Field component={EditorField.Field} />
 * ```
 */
export default class Editor extends Component<Props, State> {
  editor: ?HTMLElement;

  state = {
    editorState: createEditorState(
      convertToRaw(importer(this.props.value || ''))
    )
  };

  rendererFn = (setEditorState: any => void, getEditorState: () => any) => {
    const rFnOld = rendererFn(setEditorState, getEditorState);
    const rFnNew = (contentBlock: any) => {
      const type = contentBlock.getType();
      switch (type) {
        case Block.IMAGE:
          return {
            component: ImageBlock,
            props: {
              setEditorState,
              getEditorState
            }
          };
        default:
          return rFnOld(contentBlock);
      }
    };
    return rFnNew;
  };

  onChange = (editorState: any) => {
    this.setState({ editorState }, () =>
      this.props.onChange(exporter(this.state.editorState.getCurrentContent()))
    );
  };

  componentDidMount() {
    if (this.editor && this.props.autoFocus) {
      this.editor.focus();
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <DraftEditor
        ref={node => {
          this.editor = node;
        }}
        blockButtons={
          this.props.simple
            ? []
            : BLOCK_BUTTONS.filter(({ style }) => style !== Block.TODO)
        }
        inlineButtons={INLINE_BUTTONS.filter(
          ({ style }) => style !== Inline.HIGHLIGHT
        )}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        placeholder={this.props.placeholder}
        editorEnabled={!this.props.disabled}
        editorState={editorState}
        rendererFn={this.rendererFn}
        onChange={this.onChange}
        sideButtons={
          this.props.simple
            ? []
            : [
                {
                  title: 'Image',
                  component: ImageButton
                },
                {
                  title: 'Editor info',
                  component: InfoButton
                }
              ]
        }
      />
    );
  }
}
