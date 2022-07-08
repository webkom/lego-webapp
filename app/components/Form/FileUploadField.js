// @flow
import { Component } from 'react';
import cx from 'classnames';
import type { FieldProps } from 'redux-form';

import FileUpload from 'app/components/Upload/FileUpload';
import Icon from '../Icon';
import { Flex } from '../Layout';
import { createField } from './Field';

import styles from './FileUploadField.css';

type Props = {
  className?: string,
  style?: Object,
  meta: Object,
  value?: string,
  onChange: (string) => void,
  placeholder: string,
} & FieldProps;

class FileUploadField extends Component<Props> {
  static Field: any;

  render() {
    const { className, style, input, value, meta, placeholder, ...restprops } =
      this.props;

    return (
      <Flex
        alignItems="center"
        className={cx(styles.base, className)}
        style={style}
      >
        <FileUpload {...restprops} {...input} {...meta} />
        <span className={styles.value}>{value ? value : placeholder}</span>
        {value && (
          <Icon
            onClick={(e) => {
              e.preventDefault();

              this.props.onChange('');
            }}
            name="close"
            size={36}
            className={styles.removeIcon}
          />
        )}
      </Flex>
    );
  }
}

FileUploadField.Field = createField(FileUploadField);
export default FileUploadField;
