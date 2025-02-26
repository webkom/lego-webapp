import cx from 'classnames';
import ImageUpload from '~/components/Upload/ImageUpload';
import { uploadFile } from '~/redux/actions/FileActions';
import { useAppDispatch } from '~/redux/hooks';
import { createField } from './Field';
import styles from './ImageUploadField.module.css';
import type { ComponentProps, CSSProperties } from 'react';
import type { DropFile } from '~/components/Upload/ImageUpload';

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
