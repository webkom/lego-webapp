import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Component } from 'react';
import FileUpload from 'app/components/Upload/FileUpload';
import { createField } from './Field';
import styles from './FileUploadField.css';

type Props = {
  className?: string;
  style?: Record<string, any>;
  meta: Record<string, any>;
  value?: string;
  onChange: (arg0: string) => void;
  placeholder: string;
};

class FileUploadField extends Component<Props> {
  static Field: any;

  render() {
    const { className, style, value, meta, placeholder, ...restprops } =
      this.props;
    return (
      <Flex
        alignItems="center"
        className={cx(styles.base, className)}
        style={style}
      >
        <FileUpload {...restprops} {...meta} />
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
