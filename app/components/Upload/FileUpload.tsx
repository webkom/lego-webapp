import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { connect } from 'react-redux';
import { uploadFile } from 'app/actions/FileActions';
import styles from './FileUpload.css';

type State = {
  pending: boolean;
};
type Props = {
  uploadFile: (arg0: { file: File }) => Promise<any>;
  onChange: (arg0: string, arg1: string) => void;
  className?: string;
};

class FileUpload extends Component<Props, State> {
  input: HTMLInputElement | null | undefined;
  state = {
    pending: false,
  };
  handleClick = () => {
    this.input && this.input.click();
  };
  handleChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      pending: true,
    });
    this.props
      .uploadFile({
        file,
      })
      .then(({ meta }) => {
        this.setState({
          pending: false,
        });
        this.props.onChange(meta.fileKey, meta.fileToken);
      })
      .catch((error) => {
        this.setState({
          pending: false,
        });
        throw error;
      });
  };

  render() {
    return (
      <div>
        <Button
          isPending={this.state.pending}
          onPress={this.handleClick}
          className={this.props.className}
        >
          Last opp fil
        </Button>
        <input
          ref={(ref) => (this.input = ref)}
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
  uploadFile,
};
export default connect(null, mapDispatchToProps)(FileUpload);
