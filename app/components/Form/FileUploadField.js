// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import type { FormProps } from 'redux-form';
import { Flex } from '../Layout';
import { createField } from './Field';
import Icon from '../Icon';
import FileUpload from 'app/components/Upload/FileUpload';
import styles from './FileUploadField.css';

type Props = {
  className?: string,
  style?: Object,
  onChange: string => void
};

class FileUploadField extends Component<Props & FormProps> {
  static Field: any;

  render() {
    const { className, style, ...props } = this.props;

    return (
      <Flex
        alignItems="center"
        className={cx(styles.base, className)}
        style={style}
      >
        <FileUpload {...props} {...props.input} {...props.meta} />
        <span className={styles.value}>
          {props.value ? props.value : props.placeholder}
        </span>
        {props.value && (
          <Icon
            onClick={e => {
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
