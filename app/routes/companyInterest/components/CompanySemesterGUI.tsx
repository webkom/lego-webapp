import { Flex, Icon, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import {
  addSemester,
  editSemester,
  fetchSemesters,
} from 'app/actions/CompanyActions';
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
  selectAllCompanySemesters,
  selectCompanySemestersForInterestForm,
} from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Semester } from 'app/store/models';
import { createValidator, required } from 'app/utils/validation';
import { semesterToText } from '../utils';
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
    <Page title="Endre aktive semestre" back={{ href: '/company-interest' }}>
      <Flex wrap gap="var(--spacing-xl)">
        <Flex column>
          <AddSemesterForm />
        </Flex>
        <Flex column>
          <label className={styles.heading}>Deaktiver semestre</label>
          <ActiveSemesters />
        </Flex>
      </Flex>
    </Page>
  );
};

const AddSemesterForm = () => {
  const semesters = useAppSelector(selectAllCompanySemesters);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchSemesters', () => dispatch(fetchSemesters()), []);

  const onSubmit = (
    { year, semester }: FormValues,
    form: FormApi<FormValues>,
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
        : addSemester({ year: Number(year), semester }), // Default is activeInterestForm: true
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
      validateOnSubmitOnly
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
              value={Semester.Spring}
              type="radio"
              component={RadioButton.Field}
            />
            <Field
              name="Autumn"
              label="Høst"
              value={Semester.Autumn}
              type="radio"
              component={RadioButton.Field}
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
    selectCompanySemestersForInterestForm(state),
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
