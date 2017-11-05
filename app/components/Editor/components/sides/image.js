//@flow

import React from 'react';
import SideButton from './SideButton';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { EditorState } from 'draft-js';
import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';

type Props = {
  setEditorState: (EditorState, () => void) => void,
  getEditorState: () => EditorState,
  close: () => void
};

type State = {
  showUpload: boolean
};

export default class ImageButton extends React.Component<Props, State> {
  input: HTMLInputElement;

  state = {
    showUpload: false
  };

  onClick = () => {
    this.setState({ showUpload: true });
  };

  onSubmit = (image: File) => {
    this.props.setEditorState(
      addNewBlock(this.props.getEditorState(), Block.IMAGE, {
        image
      }),
      this.props.close
    );
  };

  render() {
    return (
      <SideButton active={false} icon="photo" onClick={this.onClick}>
        {this.state.showUpload && (
          <ImageUpload
            onClose={this.props.close}
            onSubmit={this.onSubmit}
            inModal
            crop
          />
        )}
      </SideButton>
    );
  }
}
