import { Flex, Icon, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { X } from 'lucide-react';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import {
  addSemester,
  editSemester,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
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
import styles from './CompanyInterest.module.css';
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
    <Page
      title="Endre aktive semestre"
      back={{ href: '/bdb/company-interest' }}
    >
      <ContentSection>
        <ContentMain>
          <AddSemesterForm />
        </ContentMain>
        <ContentSidebar>
          <div>
            <h3>Deaktiver semestre</h3>
            <ActiveSemesters />
          </div>
        </ContentSidebar>
      </ContentSection>
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
          <h3>Legg til aktivt semester</h3>
          <MultiSelectGroup name="semester" legend="Semester">
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
          <Field
            placeholder={moment().year() + 1}
            label="År"
            name="year"
            type="number"
            component={TextInput.Field}
            className={styles.yearForm}
            required
          />
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

  if (activeSemesters.length === 0) {
    return <EmptyState body="Ingen aktive semestre" />;
  }

  return (
    <Flex column gap="var(--spacing-sm)">
      {activeSemesters.map((semester, index) => (
        <Flex key={index} alignItems="center" gap="var(--spacing-xs)">
          <span>{semesterToText({ ...semester, language: 'norwegian' })}</span>
          <Icon
            iconNode={<X />}
            danger
            size={20}
            onPress={() =>
              dispatch(editSemester({ ...semester, activeInterestForm: false }))
            }
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default CompanySemesterGUI;
