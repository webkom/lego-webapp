import cx from 'classnames';
import { uploadFile } from 'app/actions/FileActions';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { useAppDispatch } from 'app/store/hooks';
import { createField } from './Field';
import styles from './ImageUploadField.module.css';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { ComponentProps, CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
  onChange: (fileToken: string) => void;
} & Omit<ComponentProps<typeof ImageUpload>, 'onSubmit'>;

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
      <ImageUpload onSubmit={onSubmit} {...props} />
    </div>
  );
};

export default createField(ImageUploadField);
