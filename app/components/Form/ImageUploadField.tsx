import cx from 'classnames';
import { Component } from 'react';
import { connect } from 'react-redux';
import { uploadFile } from 'app/actions/FileActions';
import type { UploadArgs } from 'app/actions/FileActions';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { createField } from './Field';
import styles from './ImageUploadField.module.css';

type Props = {
  className?: string;
  style?: Record<string, any>;
  name: string;
  value?: string;
  uploadFile: (arg0: UploadArgs) => Promise<any>;
  onChange: (arg0: string | null | undefined) => void;
  edit: (arg0: string) => Promise<any>;
};

class ImageUploadField extends Component<Props> {
  onSubmit = (file: File | Array<DropFile>) => {
    if (Array.isArray(file)) throw new Error('Expected only one file');
    this.props
      .uploadFile({
        file,
      })
      .then(({ meta }) => {
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
          {...(props as Record<string, any>)}
        />
      </div>
    );
  }
}

export default connect(null, {
  uploadFile,
})(createField(ImageUploadField));
