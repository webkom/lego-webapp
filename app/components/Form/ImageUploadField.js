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
  onChange: () => void,
  edit: () => Promise<*>
};

class ImageUploadField extends Component {
  props: Props;

  static Field: any;

  setValue = (image: File) => {
    this.props.uploadFile({ file: image, isPublic: true }).then(action => {
      const token = action.meta.fileToken;
      if (this.props.edit) {
        this.props.edit(token);
      } else {
        this.props.onChange(token);
      }
    });
  };

  render() {
    const { className, style, ...props } = this.props;
    const imageClass = className ? className : styles.coverImage;
    return (
      <div className={cx(styles.base, imageClass)} style={style}>
        <ImageUpload
          className={styles.textField}
          onSubmit={this.setValue}
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
