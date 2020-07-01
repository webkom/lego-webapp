// @flow
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/Editor.css';
import '@webkom/lego-editor/dist/components/Toolbar.css';
import '@webkom/lego-editor/dist/components/ImageUpload.css';
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
 * due to the form not being initialized. Because the editorstate is immutable, the editorfield does not update once it is passed the correct initialvalue on the second render.
 * The initialized prop "solves" the issue by enabling the editorfield to only render once the form has been initialized.
 * The initialized prop is passed to the form by the redux-form HoC, see the redux form docs for more info. The "solution" is a hack, yet i could find no better way to solve this.
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

// $FlowFixMe
EditorField.Field = connect(
  null,
  mapDispatchToProps
)(createField(EditorFieldComponent, { noLabel: true }));

export default EditorField;
