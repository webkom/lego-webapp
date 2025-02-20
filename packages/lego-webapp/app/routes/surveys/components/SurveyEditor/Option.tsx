import { Flex, Icon } from '@webkom/lego-bricks';
import { X } from 'lucide-react';
import { Field } from 'react-final-form';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import { SurveyQuestionType } from '~/redux/models/SurveyQuestion';
import styles from '../surveys.module.css';

type Props = {
  questionType: string;
  option: string;
  onChange?: (arg0: any) => void;
  index: number;
  remove?: () => void;
};

const RemoveButton = ({ remove }: { remove?: () => void }) =>
  remove ? <Icon iconNode={<X />} onPress={remove} /> : null;

const Option = (props: Props) => {
  return props.questionType === SurveyQuestionType.SingleChoice ? (
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
        placeholder="Begynn å skrive for å legge til alternativ"
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
        placeholder="Begynn å skrive for å legge til alternativ"
        fieldClassName={styles.optionField}
      />
      <RemoveButton remove={props.remove} />
    </Flex>
  );
};

export default Option;
