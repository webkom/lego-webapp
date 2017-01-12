import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

type Props = {
  onSubmit: () => void,
  accept?: String
};


export default class Upload extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
  }

  onDrop = (acceptedFiles) => {
    this.setState({
      file: acceptedFiles[0]
    });
  }

  handleSubmit = () => {
    if (this.state.file) {
      this.props.onSubmit(this.state.file);
      this.setState({ file: null });
    }
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false} accept={this.props.accept}>
          {this.props.user.picture &&
            <img src={this.props.user.picture} />}
          <div>Drop your photo in this area or click to upload.</div>
        </Dropzone>
        {
          this.state.file &&
            <div>
              Preview of new profile picture:<br />
              <img width={400} src={this.state.file.preview} /><br />
              <button onClick={this.handleSubmit}>Save new profile picture</button>
            </div>
        }
      </div>
    );
  }

}
