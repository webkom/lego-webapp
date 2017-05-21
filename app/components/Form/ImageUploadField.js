// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { createField } from './Field';
import { ImageUpload } from 'app/components/Upload';
import styles from './ImageUploadField.css';

type Props = {
  type?: string,
  className?: string,
  uploadFile: () => Promise<*>,
  onChange: () => void
};

class ImageUploadField extends Component {
  props: Props;

  state = {
    tempImg: null,
    token: ''
  };

  static Field: any;

  setValue = (image: File) => {
    this.props.uploadFile({ file: image, isPublic: true }).then(action => {
      const token = action.meta.fileToken;
      this.setState(
        state => ({
          token,
          tempImg: window.URL.createObjectURL(image)
        }),
        this.commit
      );
    });
  };

  commit = () => this.props.onChange(this.state.token);

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={styles.coverImage}>
        <ImageUpload
          className={cx(styles.textField, className)}
          onSubmit={this.setValue}
          tempImg={this.state.tempImg}
          {...props}
          {...props.input}
          {...props.meta}
        />
      </div>
    );
  }
}

ImageUploadField.Field = createField(ImageUploadField);
export default ImageUploadField;
