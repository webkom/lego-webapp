import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styles from './UploadImage.css';

type Props = {
  onSubmit: () => void,
  onDrop?: () => void,
  multiple?: Boolean,
  accept?: String
};

class Upload extends Component {
  props: Props;

  state = {
    file: null,
    files: []
  };

  onDrop = acceptedFiles => {
    if (!this.props.mutiple) {
      this.setState({ file: acceptedFiles[0] }, () =>
        this.props.onDrop(this.state.file)
      );
    }
  };

  render() {
    return (
      <Dropzone
        className={styles.dropArea}
        activeClassName={styles.activeDropArea}
        onDrop={this.onDrop}
        multiple={this.props.mutiple}
        accept={this.props.accept}
      >
        {this.props.children}
      </Dropzone>
    );
  }
}

export default Upload;
export { default as ImageUpload } from './ImageUpload';
