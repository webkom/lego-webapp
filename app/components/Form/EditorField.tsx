import Editor from '@webkom/lego-editor';
import cx from 'classnames';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from 'app/actions/FileActions';
import { useAppDispatch } from 'app/store/hooks';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string;
  className?: string;
  input: any;
  meta: any;
  name: string;
  initialized: boolean;
};

class NoSSRError {
  error: Error;

  constructor(msg) {
    this.error = new Error(msg);
  }
}

const EditorField = ({ className, name, ...props }: Props) => {
  if (!__CLIENT__) {
    throw new NoSSRError('Cannot SSR editor');
  }

  const dispatch = useAppDispatch();

  const imageUpload = async (file: File) => {
    const response = await dispatch(
      uploadFile({
        file,
        isPublic: true,
      })
    );
    return {
      fileKey: response.meta.fileKey,
    };
  };

  return (
    <div name={name}>
      <Editor
        className={cx(styles.input, className)}
        {...props}
        {...props.input}
        {...props.meta}
        imageUpload={imageUpload}
      />
    </div>
  );
};

EditorField.Field = createField(EditorField, {
  noLabel: true,
});
export default EditorField;
