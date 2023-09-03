import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
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
  remove ? (
    <Button flat onClick={remove}>
      <Icon name="close" />
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
    <Flex alignItems="center" gap={5}>
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
    <Flex alignItems="center" gap={5}>
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
