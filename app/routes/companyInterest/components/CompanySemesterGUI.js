// @flow

import type { FormProps } from 'redux-form';
import { Field, reset } from 'redux-form';

import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  Form,
  legoForm,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { createValidator, required } from 'app/utils/validation';
import { SemesterNavigation, semesterToText } from '../utils';

import styles from './CompanyInterest.css';

type Props = {
  onSubmit: (CompanySemesterEntity) => Promise<*>,
  push: (string) => void,
  events: Array<Object>,
  semesters: Array<CompanySemesterEntity>,
  autoFocus: any,
  edit: boolean,
  editSemester: (CompanySemesterEntity) => void,
  addSemester: (CompanySemesterEntity) => void,
  activeSemesters: Array<CompanySemesterEntity>,
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
              props.editSemester({
                ...semester,
                activeInterestForm: false,
              })
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
          <Flex column style={{ marginRight: '50px' }}>
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
            <Button submit className={styles.submit}>
              Legg til semester
            </Button>
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
  else return addSemester({ year, semester }); // Default is activeInterestForm: true
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
