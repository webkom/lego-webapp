// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { createField } from './Field';
import { uploadFile } from 'app/actions/FileActions';
import type { UploadArgs } from 'app/actions/FileActions';
import type { DropFile } from 'app/components/Upload';
import { connect } from 'react-redux';
import ImageUpload from 'app/components/Upload/ImageUpload';
import styles from './ImageUploadField.css';

type Props = {
  className?: string,
  style?: Object,
  name: string,
  value?: string,
  uploadFile: (UploadArgs) => Promise<*>,
  onChange: (?string) => void,
  edit: (string) => Promise<*>,
};

class ImageUploadField extends Component<Props> {
  onSubmit = (file: File | Array<DropFile>) => {
    if (Array.isArray(file)) throw new Error('Expected only one file');
    this.props.uploadFile({ file }).then(({ meta }) => {
      this.props.onChange(meta.fileToken);
    });
  };

  render() {
    const { className, name, style, ...props } = this.props;

    return (
      <div
        className={cx(styles.base, styles.coverImage, className && className)}
        style={style}
        name={name}
      >
        <ImageUpload
          className={styles.textField}
          onSubmit={this.onSubmit}
          showErrors={false}
          {...(props: Object)}
        />
      </div>
    );
  }
}

export default connect(null, { uploadFile })(createField(ImageUploadField));
