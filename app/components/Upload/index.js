// @flow

import { Component } from 'react';
import Dropzone from 'react-dropzone';
import styles from './UploadImage.css';

export type DropFile = File & {
  preview: string,
};

type Props = {
  onDrop: (Array<DropFile>) => void,
  multiple?: boolean,
  accept?: string,
  children?: any,
};

type State = {
  files: Array<DropFile>,
};

class Upload extends Component<Props, State> {
  static defaultProps = {
    onDrop: () => {},
  };

  state = {
    files: [],
  };

  onDrop = (acceptedFiles: Array<DropFile>) => {
    if (!this.props.multiple) {
      this.setState({ files: acceptedFiles }, () =>
        this.props.onDrop(this.state.files)
      );
    } else {
      this.setState(
        (state) => ({ files: state.files.concat(acceptedFiles) }),
        () => this.props.onDrop(acceptedFiles)
      );
    }
  };

  render() {
    const { multiple, accept, children } = this.props;
    return (
      <Dropzone
        className={styles.dropArea}
        onDrop={this.onDrop}
        multiple={multiple}
        accept={accept}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </Dropzone>
    );
  }
}

export default Upload;
