//@flow
import React from 'react';
import { EditorState } from 'draft-js';
import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';

type Props = {
  setEditorState: EditorState => void,
  getEditorState: () => EditorState,
  close: () => void
};

export default class ImageButton extends React.Component<Props> {
  input: HTMLInputElement;

  onClick = () => {
    this.input.value = null;
    this.input.click();
  };

  onChange = (e: SyntheticInputEvent<*>) => {
    // e.preventDefault();
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      // console.log(this.props.getEditorState());
      // eslint-disable-next-line no-undef
      const src = URL.createObjectURL(file);
      this.props.setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          src
        })
      );
    }
    this.props.close();
  };

  render() {
    return (
      <button
        className="md-sb-button md-sb-img-button"
        type="button"
        onClick={this.onClick}
        title="Add an Image"
      >
        <i className="fa fa-image" />
        <input
          type="file"
          accept="image/*"
          ref={c => {
            this.input = c;
          }}
          onChange={this.onChange}
          style={{ display: 'none' }}
        />
      </button>
    );
  }
}
