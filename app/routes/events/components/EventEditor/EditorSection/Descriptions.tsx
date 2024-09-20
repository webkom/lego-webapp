import { Field } from 'react-final-form';
import { EditorField, TextEditor } from 'app/components/Form';
import styles from '../EventEditor.css';
import type { UploadArgs } from 'app/actions/FileActions';

type Props = {
  uploadFile: (uploadArgs: UploadArgs) => void;
};

const Descriptions = ({ uploadFile }: Props) => {
  return (
    <>
      <Field
        name="description"
        label="Kalenderbeskrivelse"
        placeholder="Kom på fest den ..."
        component={TextEditor.Field}
        required
      />
      <Field
        name="text"
        label="Hovedbeskrivelse"
        component={EditorField.Field}
        placeholder="Dette blir tidenes fest ..."
        className={styles.descriptionEditor}
        uploadFile={uploadFile}
        required
      />
    </>
  );
};

export default Descriptions;
