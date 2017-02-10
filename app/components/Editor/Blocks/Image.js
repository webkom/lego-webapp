import React, { Component } from 'react';
import styles from './Image.css';

export default class ImageBlock extends Component {

  state = {
    fileToken: null,
    uploading: false,
    error: false
  }

  componentDidMount = () => {
    this.uploadImage();
  }

  uploadImage = () => {
    const { node } = this.props;
    const { data, key } = node.toJS();

    if (data.fileToken) {
      return;
    }

    this.setState({
      ...this.state,
      uploading: true
    });

    data.uploadFile(data.image)
      .then(({ meta }) => {
        this.setState({
          ...this.state,
          uploading: false,
          error: null
        });
        data.setBlockData(key, {
          ...data,
          fileToken: meta.fileToken
        });
      })
      .catch(() => {
        this.setState({
          ...this.state,
          uploading: false,
          error: true
        });
      });
  }

  retry = (e) => {
    e.preventDefault();
    this.uploadImage();
  }

  render() {
    const { node, state, attributes } = this.props;
    const { uploading, error } = this.state;
    const { data } = node.toJS();
    const isFocused = state.selection.hasEdgeIn(node);
    const style = isFocused ? { border: '1px solid blue' } : {};
    return (
      <div>
        {uploading && <div className={styles.loader} />}
        <img
          src={data.src}
          {...attributes}
          className={styles.image}
          style={style}
          data-file-token={data.fileToken}
        />
        {(!uploading && error) &&
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'red', display: 'flex', 'flex-direction': 'column', 'justify-content': 'center' }}>
            <span style={{ textAlign: 'center' }}>
              There was an error uploading the image:
              <br />
              {error}
              <br />
              <b><a onClick={this.retry}>
                Retry?
              </a></b>
            </span>
          </div>
        }
      </div>
    );
  }
}
