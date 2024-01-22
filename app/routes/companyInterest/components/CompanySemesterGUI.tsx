import { Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import {
  addSemester,
  editSemester,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { Content } from 'app/components/Content';
import {
  Form,
  TextInput,
  RadioButton,
  MultiSelectGroup,
  LegoFinalForm,
} from 'app/components/Form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import {
  selectCompanySemesters,
  selectCompanySemestersForInterestForm,
} from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Semester } from 'app/store/models';
import { createValidator, required } from 'app/utils/validation';
import { semesterToText, SemesterNavigation } from '../utils';
import styles from './CompanyInterest.css';
import type { FormApi } from 'final-form';

type FormValues = {
  year: string;
  semester: Semester;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const CompanySemesterGUI = () => {
  return (
    <Content>
      <SemesterNavigation title="Endre aktive semestre" />
      <Flex className={styles.guiWrapper}>
        <Flex
          column
          style={{
            marginRight: '50px',
          }}
        >
          <AddSemesterForm />
        </Flex>
        <Flex column>
          <label className={styles.heading}>Deaktiver semestre</label>
          <ActiveSemesters />
        </Flex>
      </Flex>
    </Content>
  );
};

const AddSemesterForm = () => {
  const semesters = useAppSelector((state) => selectCompanySemesters(state));

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchSemesters', () => dispatch(fetchSemesters()), []);

  const onSubmit = (
    { year, semester }: FormValues,
    form: FormApi<FormValues>
  ) => {
    const existingCompanySemester = semesters.find((companySemester) => {
      return (
        Number(companySemester.year) === Number(year) &&
        companySemester.semester === semester
      );
    });

    dispatch(
      existingCompanySemester
        ? editSemester({ ...existingCompanySemester, activeInterestForm: true })
        : addSemester({ year: Number(year), semester }) // Default is activeInterestForm: true
    ).then(() => {
      form.reset();
    });
  };

  const initialValues: Partial<FormValues> = {
    semester: Semester.Spring,
  };

  return (
    <TypedLegoForm
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
              inputValue={Semester.Spring}
            />
            <Field
              name="Autumn"
              label="Høst"
              component={RadioButton.Field}
              inputValue={Semester.Autumn}
            />
          </MultiSelectGroup>

          <SubmissionError />
          <SubmitButton>Legg til semester</SubmitButton>
        </Form>
      )}
    </TypedLegoForm>
  );
};

const ActiveSemesters = () => {
  const activeSemesters = useAppSelector((state) =>
    selectCompanySemestersForInterestForm(state)
  );

  const dispatch = useAppDispatch();

  return (
    <Flex column>
      {activeSemesters.map((semester, index) => (
        <Flex key={index} className={styles.guiBoxes}>
          <div>{semesterToText({ ...semester, language: 'norwegian' })}</div>
          <Icon
            name="close-circle"
            onClick={() =>
              dispatch(editSemester({ ...semester, activeInterestForm: false }))
            }
            className={styles.remove}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default CompanySemesterGUI;
