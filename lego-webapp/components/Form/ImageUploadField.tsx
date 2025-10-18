import { ImageUpload, DropFile } from '@webkom/lego-bricks';
import cx from 'classnames';
import { uploadFile } from '~/redux/actions/FileActions';
import { useAppDispatch } from '~/redux/hooks';
import { createField } from './Field';
import styles from './ImageUploadField.module.css';
import type { ComponentProps, CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
  onChange: (fileToken: string) => void;
} & Omit<ComponentProps<typeof ImageUpload>, 'onSubmit'>;

const ImageUploadField = ({
  className,
  style,
  aspectRatio,
  ...props
}: Props) => {
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
      style={{ aspectRatio, ...style }}
    >
      <ImageUpload aspectRatio={aspectRatio} onSubmit={onSubmit} {...props} />
    </div>
  );
};

export default createField(ImageUploadField);
