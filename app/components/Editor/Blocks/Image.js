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
    const { data } = node.toJS();
    this.setState({
      ...this.state,
      uploading: true
    });

    data.uploadFile(data.image)
      .then(({ meta }) => {
        this.setState({
          ...this.state,
          uploading: false,
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

  render() {
    const { node, state, attributes } = this.props;
    const { fileToken, uploading } = this.state;
    const { data } = node.toJS();
    const isFocused = state.selection.hasEdgeIn(node);
    const style = isFocused ? { border: '1px solid blue' } : {};

    return (
      <div>
        {uploading && <div className={styles.loader} />}
        <img
          src={data.src}
          data-fileToken={fileToken}
          {...attributes}
          className={styles.image}
          style={style}
        />
      </div>
    );
  }
}
