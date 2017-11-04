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

export default class BreakButton extends React.Component<Props> {
  onClick = () => {
    const { setEditorState, getEditorState } = this.props;
    setEditorState(addNewBlock(getEditorState(), Block.BREAK));
  };

  render() {
    return (
      <button className="md-sb-button" onClick={this.onClick} type="button">
        <i className="fa fa-minus" />
      </button>
    );
  }
}
