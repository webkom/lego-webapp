import { Card, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import { ContentMain } from '~/components/Content';
import {
  Form,
  MultiSelectGroup,
  RadioButton,
  TextInput,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { semesterCodeToName } from '~/pages/bdb/utils';
import {
  addSemester,
  addSemesterFiles,
  fetchAllAdmin,
  fetchSemesters,
} from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Semester } from '~/redux/models';
import { selectCompanyById } from '~/redux/slices/companies';
import { selectAllCompanySemesters } from '~/redux/slices/companySemesters';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import { createValidator, required } from '~/utils/validation';
import styles from './AddSemester.module.css';
import type { AdminDetailCompany } from '~/redux/models/Company';

type FormValues = {
  year: number;
  semester: Semester;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const AddSemester = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useAppSelector((state) =>
    selectCompanyById<AdminDetailCompany>(state, companyId),
  );
  const companySemesters = useAppSelector(selectAllCompanySemesters);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAddSemester',
    () =>
      Promise.allSettled([
        dispatch(fetchSemesters()),
        dispatch(fetchAllAdmin()),
      ]),
    [companyId],
  );

  const [submit, setSubmit] = useState(false);
  const [foundSemesterFiles, setFoundSemesterFiles] = useState<{
    semester: Semester;
    year: number;
  }>();

  if (!company) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = ({ year, semester }: FormValues) => {
    setFoundSemesterFiles(undefined);

    if (!submit) return;

    const globalSemester = companySemesters.find(
      (companySemester) =>
        companySemester.year === year && companySemester.semester === semester,
    );

    if (globalSemester) {
      const foundSemesterFiles = company.semesterFiles?.find(
        (semesterFiles) => semesterFiles.semester === globalSemester.id,
      );

      if (foundSemesterFiles) {
        setFoundSemesterFiles({ semester, year });
        return;
      }

      return dispatch(
        addSemesterFiles({
          companyId,
          semester: globalSemester.id,
        }),
      ).then(() => {
        navigate(`/bdb/${companyId}/`);
      });
    }

    return dispatch(
      addSemester({
        year,
        semester,
      }),
    ).then((response) => {
      dispatch(
        addSemesterFiles({
          companyId,
          semester: response.payload.result,
        }),
      ).then(() => {
        navigate(`/bdb/${companyId}/`);
      });
    });
  };

  const initialValues: FormValues = {
    year: moment().year(),
    semester: moment().month() > 6 ? Semester.Spring : Semester.Autumn,
  };

  return (
    <Page
      title="Legg til semester"
      back={{
        href: `/bdb/${companyId}/`,
      }}
    >
      <ContentMain>
        <Card severity="info">
          <Card.Header>Hint</Card.Header>
          <span>
            Semestre med arrangementer eller interesseskjema vises automatisk.
            Legg til et semester her for å laste opp filer før det har skjedd
            noe.
          </span>
        </Card>

        <TypedLegoForm
          onSubmit={onSubmit}
          validate={validate}
          initialValues={initialValues}
          subscription={{}}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <MultiSelectGroup name="semester" legend="Semester">
                <Field
                  name="Spring"
                  label="Vår"
                  value="spring"
                  type="radio"
                  component={RadioButton.Field}
                  showErrors={false}
                />
                <Field
                  name="Autumn"
                  label="Høst"
                  value="autumn"
                  type="radio"
                  component={RadioButton.Field}
                  showErrors={false}
                />
              </MultiSelectGroup>

              <Field
                placeholder={moment().year() + 1}
                label="År"
                name="year"
                type="number"
                component={TextInput.Field}
                className={styles.yearForm}
              />

              {foundSemesterFiles && (
                <Card severity="danger">
                  <Card.Header>Feil</Card.Header>
                  <span>
                    Denne bedriften har allerede registrert{' '}
                    {semesterCodeToName(foundSemesterFiles.semester)}{' '}
                    {foundSemesterFiles.year}. Du kan laste opp filer på
                    bedriftens side.
                  </span>
                </Card>
              )}

              <SubmissionError />
              <SubmitButton onPress={() => setSubmit(true)}>
                Legg til
              </SubmitButton>
            </Form>
          )}
        </TypedLegoForm>
      </ContentMain>
    </Page>
  );
};

export default guardLogin(AddSemester);
