// @flow

import React, { Component } from 'react';
import type { BlockNodeRecord } from 'draft-js/lib/BlockNodeRecord.js.flow';
import type ContentState from 'draft-js/lib/ContentState.js.flow';
import type { BidiDirection } from 'fbjs/lib/UnicodeBidiDirection';
import type { List } from 'immutable';
import type { DraftDecoratorType } from 'draft-js/lib/DraftDecoratorType.js.flow';
import type { DraftInlineStyle } from 'draft-js/lib/DraftInlineStyle.js.flow';
import { EditorBlock, EditorState, SelectionState } from 'draft-js';
import { getCurrentBlock, updateDataOfBlock } from 'medium-draft';
import cx from 'classnames';
import { connect } from 'react-redux';
import type { UploadArgs } from 'app/actions/FileActions';
import { uploadFile } from 'app/actions/FileActions';
import styles from './ImageBlock.css';
import { Image } from 'app/components/Image';

type Props = {
  block: BlockNodeRecord,
  blockProps: Object,
  blockStyleFn: (block: BlockNodeRecord) => string,
  contentState: ContentState,
  customStyleFn: (style: DraftInlineStyle, block: BlockNodeRecord) => ?Object,
  customStyleMap: Object,
  decorator: ?DraftDecoratorType,
  direction: BidiDirection,
  forceSelection: boolean,
  offsetKey: string,
  selection: SelectionState,
  startIndent?: boolean,
  tree: List<any>,
  uploadFile: UploadArgs => Promise<*>
};

type State = {
  uploading: boolean,
  fileKeyToken?: string,
  error?: string
};

class ImageBlock extends Component<Props, State> {
  state = {
    uploading: false,
    fileKeyToken: undefined,
    error: undefined
  };

  focusBlock = () => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const currentBlock = getCurrentBlock(getEditorState());

    if (currentBlock.getKey() === key) {
      return;
    }

    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0
    });
    setEditorState(EditorState.forceSelection(getEditorState(), newSelection));
  };

  componentDidMount() {
    const { block } = this.props;
    const data = block.getData();
    const image = data.get('image');

    if (image) {
      this.setState({ uploading: true });
      this.props
        .uploadFile({ file: image, isPublic: true })
        .then(({ meta }) => {
          this.setState({ fileKeyToken: meta.fileToken, uploading: false });
          const { block, blockProps } = this.props;
          const { setEditorState, getEditorState } = blockProps;
          const data = block.getData();
          const newData = data.set('fileKey', meta.fileToken.split(':')[0]);
          setEditorState(updateDataOfBlock(getEditorState(), block, newData));
        })
        .catch(err => {
          this.setState({ error: err.message, uploading: false });
        });
    }
  }

  render() {
    const { block, blockProps } = this.props;
    const { getEditorState } = blockProps;
    const data = block.getData();
    const image = data.get('image');
    const src = data.get('src');
    const currentBlock = getCurrentBlock(getEditorState());

    return (
      <div>
        <div className={cx('md-block-image-inner-container', styles.center)}>
          {this.state.uploading && <div className={styles.loader} />}
          <Image
            role="presentation"
            alt={block.getText() || ''}
            className={cx(
              styles.image,
              currentBlock.getKey() === block.getKey() && styles.imageSelected
            )}
            src={src || window.URL.createObjectURL(image)}
          />
        </div>
        <figcaption>
          <EditorBlock {...this.props} />
        </figcaption>
      </div>
    );
  }
}

export default connect(
  null,
  { uploadFile }
)(ImageBlock);
