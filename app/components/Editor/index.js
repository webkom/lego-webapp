// @flow

import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import { createEditorState, Editor, rendererFn, Block } from 'medium-draft';
import importer from './importer';
import exporter from './exporter';
import { ImageButton } from './Sides';
import { ImageBlock } from './Blocks';
import 'medium-draft/lib/index.css';

type Props = {
  autoFocus: ?boolean,
  value: ?string,
  placeholder: ?string,
  onChange: string => void,
  onFocus: () => void,
  onBlur: () => void,
  simple: ?boolean,
  disabled: ?boolean,
};

type State = {
  editorState: any,
};

class CustomEditor extends Component<Props, State> {
  editor: ?HTMLElement;

  sideButtons = [
    {
      title: 'Image',
      component: ImageButton,
    },
  ];

  state = {
    editorState: createEditorState(convertToRaw(importer(this.props.value))),
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
              getEditorState,
            },
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
      <Editor
        ref={node => {
          this.editor = node;
        }}
        placeholder={this.props.placeholder}
        readOnly={this.props.disabled}
        editorState={editorState}
        rendererFn={this.rendererFn}
        onChange={this.onChange}
        sideButtons={this.sideButtons}
      />
    );
  }
}

export default CustomEditor;
