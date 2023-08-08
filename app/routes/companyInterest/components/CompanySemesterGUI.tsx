import { Button } from '@webkom/lego-bricks';
import { reset, Field } from 'redux-form';
import { Content } from 'app/components/Content';
import {
  Form,
  TextInput,
  RadioButton,
  RadioButtonGroup,
  legoForm,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { createValidator, required } from 'app/utils/validation';
import { semesterToText, SemesterNavigation } from '../utils';
import styles from './CompanyInterest.css';
import type { FormProps } from 'redux-form';

type Props = {
  onSubmit: (arg0: CompanySemesterEntity) => Promise<any>;
  push: (arg0: string) => void;
  events: Array<Record<string, any>>;
  semesters: Array<CompanySemesterEntity>;
  autoFocus: any;
  edit: boolean;
  editSemester: (arg0: CompanySemesterEntity) => void;
  addSemester: (arg0: CompanySemesterEntity) => void;
  activeSemesters: Array<CompanySemesterEntity>;
} & FormProps;

const CompanySemesterGUI = (props: Props) => {
  const activeSemesters = (semesters) => (
    <Flex column>
      {semesters.map((semester, index) => (
        <Flex key={index} className={styles.guiBoxes}>
          <div className={styles.checkboxSpan}>
            {semesterToText({ ...semester, language: 'norwegian' })}
          </div>
          <Icon
            name="close-circle"
            onClick={() =>
              props.editSemester({ ...semester, activeInterestForm: false })
            }
            className={styles.remove}
          />
        </Flex>
      ))}
    </Flex>
  );

  const { handleSubmit, autoFocus } = props;
  return (
    <Content>
      <SemesterNavigation title="Endre aktive semestre" />
      <Form onSubmit={handleSubmit}>
        <Flex className={styles.guiWrapper}>
          <Flex
            column
            style={{
              marginRight: '50px',
            }}
          >
            <label className={styles.heading}>Legg til aktivt semester</label>
            <Field
              autoFocus={autoFocus}
              placeholder="2020"
              label="År"
              name="year"
              type="number"
              component={TextInput.Field}
              className={styles.yearForm}
              required
            />
            <RadioButtonGroup name="semester" label="Semester">
              <Field
                name="Spring"
                label="Vår"
                component={RadioButton.Field}
                inputValue="spring"
              />
              <Field
                name="Autumn"
                label="Høst"
                component={RadioButton.Field}
                inputValue="autumn"
              />
            </RadioButtonGroup>
            <Button submit>Legg til semester</Button>
          </Flex>
          <Flex column>
            <label className={styles.heading}>Deaktiver semestre</label>
            {activeSemesters(props.activeSemesters)}
          </Flex>
        </Flex>
      </Form>
    </Content>
  );
};

const onSubmit = ({ year, semester }, dispatch, props: Props) => {
  const { semesters, addSemester, editSemester } = props;
  const existingCompanySemester = semesters.find((companySemester) => {
    return (
      Number(companySemester.year) === Number(year) &&
      companySemester.semester === semester
    );
  });
  if (existingCompanySemester)
    return editSemester({
      ...existingCompanySemester,
      activeInterestForm: true,
    });
  else
    return addSemester({
      year,
      semester,
    }); // Default is activeInterestForm: true
};

const validate = createValidator({
  year: [required()],
  semester: [required()],
});
export default legoForm({
  form: 'addCompanySemester',
  onSubmitSuccess: (result, dispatch) => dispatch(reset('addCompanySemester')),
  onSubmit,
  enableReinitialize: true,
  validate,
})(CompanySemesterGUI);
