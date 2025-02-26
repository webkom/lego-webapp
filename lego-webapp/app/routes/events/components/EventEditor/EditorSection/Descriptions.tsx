import { Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { EditorField, TextEditor } from '~/components/Form';
import Tag from '~/components/Tags/Tag';
import styles from '../EventEditor.module.css';
import type { EditingEvent } from 'app/routes/events/utils';
import type { UploadArgs } from '~/redux/actions/FileActions';

type Props = {
  uploadFile: (uploadArgs: UploadArgs) => void;
  values: EditingEvent;
};

const Descriptions: React.FC<Props> = ({ uploadFile, values }) => {
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
      {values.tags?.length > 0 && (
        <Flex className={styles.tagRow}>
          {values.tags.map((tag, i) => (
            <Tag key={i} tag={tag} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Descriptions;
