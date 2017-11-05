//@flow

import React from 'react';
import { connect } from 'react-redux';
import type { UploadArgs } from 'app/actions/FileActions';

import { EditorBlock, EditorState, SelectionState } from 'draft-js';
import { uploadFile } from 'app/actions/FileActions';
import { getCurrentBlock } from '../../model/';

import styles from './Image.css';

type Props = {
  blockProps: Object,
  block: Object,
  uploadFile: UploadArgs => Promise<*>
};

type State = {
  uploading: boolean,
  fileToken?: string,
  error?: string
};

class ImageBlock extends React.Component<Props, State> {
  state = {
    uploading: false,
    fileToken: undefined,
    error: undefined
  };

  focusBlock = () => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const editorState = getEditorState();
    const currentblock = getCurrentBlock(editorState);

    if (currentblock.getKey() === key) {
      return;
    }

    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0
    });
    setEditorState(EditorState.forceSelection(editorState, newSelection));
  };

  componentDidMount() {
    const { block } = this.props;
    const data = block.getData();
    const image = data.get('image');

    this.setState({ uploading: true });
    this.props
      .uploadFile({ file: image })
      .then(({ meta }) => {
        this.setState({ fileToken: meta.fileToken, uploading: false });
      })
      .catch(err => {
        this.setState({ error: err.message, uploading: false });
      });
  }

  render() {
    const { block } = this.props;
    const data = block.getData();
    const image = data.get('image');

    return (
      <div>
        <div className={styles.imageContainer} onClick={this.focusBlock}>
          {this.state.uploading && <div className={styles.loader} />}
          <img
            alt="presentation"
            data-file-token={this.state.fileToken}
            src={window.URL.createObjectURL(image)}
          />
        </div>
        <figcaption className={styles.imageCaption}>
          <EditorBlock {...this.props} />
        </figcaption>
      </div>
    );
  }
}

export default connect(null, { uploadFile })(ImageBlock);
