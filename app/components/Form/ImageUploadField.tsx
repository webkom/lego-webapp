import cx from 'classnames';
import { uploadFile } from 'app/actions/FileActions';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { useAppDispatch } from 'app/store/hooks';
import { createField } from './Field';
import styles from './ImageUploadField.css';
import type { DropFile } from 'app/components/Upload/ImageUpload';

type Props = {
  className?: string;
  style?: Record<string, any>;
  name: string;
  value?: string;
  onChange: (arg0: string | null | undefined) => void;
  edit: (arg0: string) => Promise<any>;
};

const ImageUploadField = ({ className, style, ...props }: Props) => {
  const dispatch = useAppDispatch();

  const onSubmit = (file: File | Array<DropFile>) => {
    if (Array.isArray(file)) throw new Error('Expected only one file');

    dispatch(
      uploadFile({
        file,
      }),
    ).then(({ meta }) => {
      props.onChange(meta.fileToken);
    });
  };

  return (
    <div
      className={cx(styles.base, styles.coverImage, className && className)}
      style={style}
    >
      <ImageUpload
        className={styles.textField}
        onSubmit={onSubmit}
        showErrors={false}
        {...props}
      />
    </div>
  );
};

export default createField(ImageUploadField);
