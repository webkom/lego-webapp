import { Card, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addSemester,
  addSemesterStatus,
  fetchAllAdmin,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { MultiSelectGroup, RadioButton, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectCompanyById } from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import {
  getContactStatuses,
  getStatusColor,
  selectMostProminentStatus,
  semesterCodeToName,
} from 'app/routes/bdb/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Semester } from 'app/store/models';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import styles from './AddSemester.css';
import SemesterStatusContent from './SemesterStatusContent';
import type {
  AdminDetailCompany,
  CompanySemesterContactStatus,
} from 'app/store/models/Company';

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
  const { companyId } = useParams<{ companyId: string }>() as {
    companyId: string;
  };
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

  const navigate = useNavigate();

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
      <Card severity="info">
        <Card.Header>Hint</Card.Header>
        <span>
          Du kan legge til status for flere semestere samtidig på Bdb-forsiden!
        </span>
      </Card>

      <TypedLegoForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              placeholder="2020"
              label="År"
              name="year"
              type="number"
              component={TextInput.Field}
              className={styles.yearForm}
            />

            <div className={styles.choices}>
              <MultiSelectGroup name="semester" label="Semester">
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
            </div>

            <label>Status</label>
            <Field name="semesterStatus">
              {({ input }) => (
                <div
                  className={styles.semesterStatus}
                  style={{
                    backgroundColor: getStatusColor(
                      selectMostProminentStatus(input.value.contactedStatus),
                    ),
                  }}
                >
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
                  Denne bedriften har allerede et registrert semester status for{' '}
                  {semesterCodeToName(foundSemesterStatus.semester)}{' '}
                  {foundSemesterStatus.year}. Du kan endre denne på bedriftens
                  side.
                </span>
              </Card>
            )}
            <SubmissionError />
            <SubmitButton onPress={() => setSubmit(true)}>
              Legg til
            </SubmitButton>
          </form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(AddSemester);
