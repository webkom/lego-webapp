// @flow
import { connect } from 'react-redux';
import cx from 'classnames';
import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from 'app/actions/FileActions';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  className?: string,
  input: any,
  meta: any,
  name: string,
  initialized: boolean,
  uploadFile: (file: Blob) => Promise<*>,
};

class NoSSRError {
  error: Error;
  constructor(msg) {
    this.error = new Error(msg);
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: async (file) => {
      const response = await dispatch(uploadFile({ file, isPublic: true }));
      return { fileKey: response.meta.fileKey };
    },
  };
};

/*
 * The reason for the initialized prop is an issue(https://github.com/redux-form/redux-form/issues/621) in redux form that causes all fields to be initially rendered with an empty string as value,
 * due to the form not being initialized. Because the editor state is immutable, the editor field does not update once it is passed the correct initial value on the second render.
 * The initialized prop "solves" the issue by enabling the editor field to only render once the form has been initialized.
 */
const EditorFieldComponent = ({
  className,
  name,
  initialized,
  uploadFile,
  ...props
}: Props) => {
  if (!__CLIENT__) {
    throw new NoSSRError('Cannot SSR editor');
  }
  return (
    <div name={name}>
      {initialized && (
        <Editor
          className={cx(styles.input, className)}
          {...props}
          {...props.input}
          {...props.meta}
          imageUpload={uploadFile}
        />
      )}
    </div>
  );
};

const EditorField = connect(null, mapDispatchToProps)(EditorFieldComponent);

EditorField.AutoInitialized = (props) =>
  EditorFieldComponent({
    initialized: !!(props.value || props.input?.value),
    ...props,
  });

// $FlowFixMe
EditorField.Field = connect(
  null,
  mapDispatchToProps
)(createField(EditorField.AutoInitialized, { noLabel: true }));

export default EditorField;
