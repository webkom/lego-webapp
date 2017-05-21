// @flow

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styles from './UploadImage.css';

type Props = {
  onSubmit: () => void,
  onDrop: () => void,
  multiple?: Boolean,
  accept?: String,
  children?: any
};

class Upload extends Component {
  props: Props;

  state = {
    file: undefined
  };

  onDrop = (acceptedFiles: Array<File>) => {
    if (!this.props.multiple) {
      this.setState({ file: acceptedFiles[0] }, () =>
        this.props.onDrop(this.state.file)
      );
    }
  };

  render() {
    const { multiple, accept, children } = this.props;
    return (
      <Dropzone
        className={styles.dropArea}
        activeClassName={styles.activeDropArea}
        onDrop={this.onDrop}
        multiple={multiple}
        accept={accept}
      >
        {children}
      </Dropzone>
    );
  }
}

export default Upload;
export { default as ImageUpload } from './ImageUpload';
