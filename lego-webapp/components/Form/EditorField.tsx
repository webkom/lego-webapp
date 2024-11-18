import Editor from '@webkom/lego-editor';
import cx from 'classnames';
import '@webkom/lego-editor/dist/style.css';
// import 'react-image-crop/dist/ReactCrop.css';
// import { uploadFile } from '~/redux/actions/FileActions';
// import { useAppDispatch } from '~/redux/hooks';
import { createField } from './Field';
import type { FieldInputProps } from 'react-final-form';

type Props = FieldInputProps<string> & {
  type?: string;
  className?: string;
  placeholder?: string;
  initialized: boolean;
};

const EditorField = ({ className, ...props }: Props) => {
  // const dispatch = useAppDispatch();
  //
  // const imageUpload = async (file: Blob) => {
  //   const response = await dispatch(
  //     uploadFile({
  //       file,
  //       isPublic: true,
  //     }),
  //   );
  //   return {
  //     fileKey: response.meta.fileKey,
  //   };
  // };

  return (
    <Editor
      className={cx(className)}
      content={props.value}
      {...props}
      // imageUpload={imageUpload}
    />
  );
};

EditorField.Field = createField(EditorField, {
  noLabel: true,
});
export default EditorField;
