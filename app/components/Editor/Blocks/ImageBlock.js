// @flow

import React, { Component, type Node } from 'react';
import { EditorBlock } from 'draft-js';
import { getCurrentBlock } from 'medium-draft';

type Props = {
  block: any,
  blockProps: Object,
  children: Node,
};

class ImageBlock extends Component<Props> {
  render() {
    console.log(this);
    const { block, blockProps } = this.props;
    const { getEditorState } = blockProps;
    const data = block.getData();
    const src = data.get('src');
    const currentBlock = getCurrentBlock(getEditorState());
    const className =
      currentBlock.getKey() === block.getKey() ? 'md-image-is-selected' : '';
    if (src !== null) {
      return (
        <div>
          test
          <div className="md-block-image-inner-container">
            <img role="presentation" className={className} src={src} />
          </div>
          <figcaption>
            <EditorBlock {...this.props} />
          </figcaption>
        </div>
      );
    }
    return <EditorBlock {...this.props} />;
  }
}
export default ImageBlock;
