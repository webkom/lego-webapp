import { Field } from 'react-final-form';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { QuestionTypes } from 'app/routes/surveys/utils';
import styles from '../surveys.css';

type Props = {
  questionType: string;
  option: string;
  onChange?: (arg0: any) => void;
  index: number;
  remove?: () => void;
};

const RemoveButton = ({ remove }: { remove?: () => void }) =>
  remove ? <Icon name="close" onClick={remove} /> : null;

const Option = (props: Props) => {
  return props.questionType === QuestionTypes('single') ? (
    <MultipleChoice {...props} />
  ) : (
    <Checkbox {...props} />
  );
};

const MultipleChoice = (props: Props) => {
  return (
    <Flex alignItems="center">
      <RadioButton value={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
        className={styles.optionInput}
        placeholder="Alternativ"
        fieldClassName={styles.optionField}
      />
      <RemoveButton remove={props.remove} />
    </Flex>
  );
};

const Checkbox = (props: Props) => {
  return (
    <Flex alignItems="center">
      <CheckBox defaultChecked={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
        className={styles.optionInput}
        placeholder="Alternativ"
        fieldClassName={styles.optionField}
      />
      <RemoveButton remove={props.remove} />
    </Flex>
  );
};

export default Option;
