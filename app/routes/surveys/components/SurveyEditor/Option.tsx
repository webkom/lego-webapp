import { Field } from 'react-final-form';
import Button from 'app/components/Button';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import { QuestionTypes } from 'app/routes/surveys/utils';
import styles from '../surveys.module.css';

type Props = {
  questionType: string;
  option: string;
  onChange?: (arg0: any) => void;
  index: number;
  remove?: () => void;
};

const RemoveButton = ({ remove }: { remove?: () => void }) =>
  remove ? (
    <Button flat onClick={remove} className={styles.removeOption}>
      <span>x</span>
    </Button>
  ) : null;

const Option = (props: Props) => {
  return props.questionType === QuestionTypes('single') ? (
    <MultipleChoice {...props} />
  ) : (
    <Checkbox {...props} />
  );
};

const MultipleChoice = (props: Props) => {
  return (
    <li>
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
    </li>
  );
};

const Checkbox = (props: Props) => {
  return (
    <li>
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
    </li>
  );
};

export default Option;
