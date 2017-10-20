// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { createField } from './Field';
import { uploadFile } from 'app/actions/FileActions';
import { connect } from 'react-redux';
import ImageUpload from 'app/components/Upload/ImageUpload';
import styles from './ImageUploadField.css';

type File = {
  isPublic: true,
  file: Object
};

type Props = {
  className?: string,
  style?: Object,
  value?: string,
  uploadFile: File => Promise<*>,
  onChange: (?string) => void,
  edit: string => Promise<*>
};

class ImageUploadField extends Component {
  props: Props;

  static Field: any;

  componentDidMount = () => {
    // hack for removing the inital url set by redux form
    this.props.onChange(null);
  };

  onSubmit = (file: File) => {
    this.props.uploadFile({ file }).then(({ meta }) => {
      this.props.onChange(meta.fileToken);
    });
  };

  render() {
    const { className, style, ...props } = this.props;
    const imageClass = className ? className : styles.coverImage;

    return (
      <div className={cx(styles.base, imageClass)} style={style}>
        <ImageUpload
          className={styles.textField}
          onSubmit={this.onSubmit}
          {...props}
        />
      </div>
    );
  }
}

export default connect(null, { uploadFile })(createField(ImageUploadField));
