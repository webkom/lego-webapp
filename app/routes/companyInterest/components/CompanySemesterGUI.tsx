import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import {
  Form,
  TextInput,
  RadioButton,
  MultiSelectGroup,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import type CompanySemester from 'app/store/models/CompanySemester';
import { createValidator, required } from 'app/utils/validation';
import { semesterToText, SemesterNavigation } from '../utils';
import styles from './CompanyInterest.css';
import type { FormApi } from 'final-form';

type Props = {
  semesters: Array<CompanySemester>;
  editSemester: (semester: CompanySemester) => Promise<void>;
  addSemester: (semester: Omit<CompanySemester, 'id'>) => Promise<void>;
  activeSemesters: Array<CompanySemester>;
  initialValues: Record<string, any>;
};

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const CompanySemesterGUI = (props: Props) => (
  <Content>
    <SemesterNavigation title="Endre aktive semestre" />
    <Flex className={styles.guiWrapper}>
      <Flex
        column
        style={{
          marginRight: '50px',
        }}
      >
        <AddSemesterForm
          semesters={props.semesters}
          addSemester={props.addSemester}
          editSemester={props.editSemester}
          initialValues={props.initialValues}
        />
      </Flex>
      <Flex column>
        <label className={styles.heading}>Deaktiver semestre</label>
        <ActiveSemesters
          semesters={props.activeSemesters}
          editSemester={props.editSemester}
        />
      </Flex>
    </Flex>
  </Content>
);

type AddSemesterProps = Pick<
  Props,
  'semesters' | 'addSemester' | 'editSemester' | 'initialValues'
>;
const AddSemesterForm = ({
  semesters,
  addSemester,
  editSemester,
  initialValues,
}: AddSemesterProps) => {
  const onSubmit = async ({ year, semester }, form: FormApi) => {
    const existingCompanySemester = semesters.find((companySemester) => {
      return (
        Number(companySemester.year) === Number(year) &&
        companySemester.semester === semester
      );
    });
    if (existingCompanySemester)
      await editSemester({
        ...existingCompanySemester,
        activeInterestForm: true,
      });
    else
      await addSemester({
        year,
        semester,
      }); // Default is activeInterestForm: true

    form.restart();
  };

  return (
    <LegoFinalForm
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
      subscription={{}}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <label className={styles.heading}>Legg til aktivt semester</label>
          <Field
            placeholder="2020"
            label="År"
            name="year"
            type="number"
            component={TextInput.Field}
            className={styles.yearForm}
            required
          />
          <MultiSelectGroup name="semester" label="Semester">
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
          </MultiSelectGroup>

          <SubmissionError />
          <SubmitButton>Legg til semester</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

type ActiveSemestersProps = {
  semesters: Array<CompanySemester>;
  editSemester: (semester: CompanySemester) => void;
};
const ActiveSemesters = ({ semesters, editSemester }: ActiveSemestersProps) => (
  <Flex column>
    {semesters.map((semester, index) => (
      <Flex key={index} className={styles.guiBoxes}>
        <div>{semesterToText({ ...semester, language: 'norwegian' })}</div>
        <Icon
          name="close-circle"
          onClick={() =>
            editSemester({ ...semester, activeInterestForm: false })
          }
          className={styles.remove}
        />
      </Flex>
    ))}
  </Flex>
);

export default CompanySemesterGUI;
