// @flow

import React, { Component } from 'react';
import { Block, addNewBlock } from 'medium-draft';

type Props = {
  setEditorState: any => void,
  getEditorState: () => any,
  close: () => void,
};

export default class ImageButton extends Component<Props> {
  input: ?HTMLInputElement;

  onClick = () => {
    if (this.input) {
      this.input.value = '';
      this.input.click();
    }
  };

  onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { close, setEditorState, getEditorState } = this.props;

    event.preventDefault();
    const file = event.target.files[0];

    if (file.type.indexOf('image/') === 0) {
      const src = URL.createObjectURL(file);

      setEditorState(
        addNewBlock(getEditorState(), Block.IMAGE, {
          src,
        })
      );
    }

    close();
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
          ref={node => {
            this.input = node;
          }}
          onChange={this.onChange}
          style={{ display: 'none' }}
        />
      </button>
    );
  }
}
