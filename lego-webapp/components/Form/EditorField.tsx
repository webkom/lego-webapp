import Editor from '@webkom/lego-editor';
import cx from 'classnames';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import { usePageContext } from 'vike-react/usePageContext';
import { uploadFile } from '~/redux/actions/FileActions';
import { useAppDispatch } from '~/redux/hooks';
import { createField } from './Field';
import styles from './TextInput.module.css';
import type { FieldInputProps } from 'react-final-form';

type Props = FieldInputProps<string> & {
  type?: string;
  className?: string;
  name: string;
  initialized: boolean;
};

const EditorField = ({ className, name, ...props }: Props) => {
  const dispatch = useAppDispatch();
  const pageContext = usePageContext();

  const imageUpload = async (file: Blob) => {
    const response = await dispatch(
      uploadFile({
        file,
        isPublic: true,
      }),
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
        domParser={import.meta.env.SSR ? pageContext.domParser : undefined}
      />
    </div>
  );
};

EditorField.Field = createField(EditorField, {
  noLabel: true,
});
export default EditorField;
