// @flow

import React from 'react';
import Button from '../Button';
import { uploadFile } from 'app/actions/FileActions';
import { connect } from 'react-redux';
import styles from './FileUpload.css';

type State = {
  pending: boolean
};

type Props = {
  uploadFile: ({ file: File }) => Promise<*>,
  onChange: (string, string) => void,
  className?: string
};

class FileUpload extends React.Component {
  props: Props;

  input: HTMLInputElement;

  state: State = {
    pending: false
  };

  handleClick = () => {
    this.input.click();
  };

  handleChange = e => {
    const file = e.target.files[0];
    this.setState({ pending: true });

    this.props
      .uploadFile({ file })
      .then(({ meta }) => {
        this.setState({ pending: false });

        this.props.onChange(meta.fileKey, meta.fileToken);
      })
      .catch(error => {
        this.setState({ pending: false });
        throw error;
      });
  };

  render() {
    return (
      <div>
        <Button
          pending={this.state.pending}
          onClick={this.handleClick}
          className={this.props.className}
        >
          Last opp fil
        </Button>
        <input
          ref={ref => (this.input = ref)}
          className={styles.input}
          onChange={this.handleChange}
          type="file"
          accept="application/pdf"
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  uploadFile
};

export default connect(null, mapDispatchToProps)(FileUpload);
