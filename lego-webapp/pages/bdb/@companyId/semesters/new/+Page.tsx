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
import { getContactStatuses, semesterCodeToName } from '~/pages/bdb/utils';
import {
  addSemester,
  addSemesterStatus,
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
import SemesterStatusContent from '../../../SemesterStatusContent';
import styles from './AddSemester.module.css';
import type {
  AdminDetailCompany,
  CompanySemesterContactStatus,
} from '~/redux/models/Company';

type FormValues = {
  year: number;
  semester: Semester;
  semesterStatus: {
    contactedStatus: CompanySemesterContactStatus[];
  };
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
  const [foundSemesterStatus, setFoundSemesterStatus] = useState<{
    semester: Semester;
    year: number;
  }>();

  if (!company) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = ({ year, semester, semesterStatus }: FormValues) => {
    setFoundSemesterStatus(undefined);

    const contactedStatus = semesterStatus.contactedStatus;

    if (!submit) return;

    const globalSemester = companySemesters.find(
      (companySemester) =>
        companySemester.year === year && companySemester.semester === semester,
    );

    if (globalSemester) {
      const foundSemesterStatus = company.semesterStatuses?.find(
        (semesterStatus) => semesterStatus.semester === globalSemester.id,
      );

      if (foundSemesterStatus) {
        setFoundSemesterStatus({ semester, year });
        return;
      }

      return dispatch(
        addSemesterStatus({
          companyId,
          semester: globalSemester.id,
          contactedStatus,
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
        addSemesterStatus({
          companyId,
          semester: response.payload.result,
          contactedStatus,
        }),
      ).then(() => {
        navigate(`/bdb/${companyId}/`);
      });
    });
  };

  const initialValues: FormValues = {
    year: moment().year(),
    semester: moment().month() > 6 ? Semester.Spring : Semester.Autumn,
    semesterStatus: {
      contactedStatus: [],
    },
  };

  return (
    <Page
      title="Legg til semesterstatus"
      back={{
        href: `/bdb/${companyId}/`,
      }}
    >
      <ContentMain>
        <Card severity="info">
          <Card.Header>Hint</Card.Header>
          <span>
            Du kan legge til status for flere semestre samtidig på BDB-forsiden!
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

              <label className={styles.label}>Status</label>
              <Field name="semesterStatus">
                {({ input }) => (
                  <div className={styles.semesterStatus}>
                    <SemesterStatusContent
                      contactedStatus={input.value.contactedStatus}
                      editFunction={(status) => {
                        input.onChange({
                          contactedStatus: getContactStatuses(
                            input.value.contactedStatus,
                            status,
                          ),
                        });
                      }}
                    />
                  </div>
                )}
              </Field>

              {foundSemesterStatus && (
                <Card severity="danger">
                  <Card.Header>Feil</Card.Header>
                  <span>
                    Denne bedriften har allerede et registrert semester status
                    for {semesterCodeToName(foundSemesterStatus.semester)}{' '}
                    {foundSemesterStatus.year}. Du kan endre denne på bedriftens
                    side.
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
