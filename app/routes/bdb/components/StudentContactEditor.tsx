import { LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  editCompany,
  fetchAdmin,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import {
  LegoFinalForm,
  Form,
  SelectInput,
  SubmissionError,
  SubmitButton,
} from 'app/components/Form';
import { selectTransformedAdminCompanyById } from 'app/reducers/companies';
import { selectCompanySemesterEntities } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import useQuery from 'app/utils/useQuery';
import { semesterToHumanReadable } from '../utils';
import type { EntityId } from '@reduxjs/toolkit';
import type CompanySemester from 'app/store/models/CompanySemester';

export type FormValues = {
  semesterId: { label: string; value: string };
  studentContacts: { label: string; value: EntityId }[];
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const StudentContactEditor = () => {
  const title = 'Rediger studentkontakter';

  const { companyId } = useParams<{
    companyId: string;
  }>();

  const { query, setQueryValue } = useQuery({ semesterId: undefined } as {
    semesterId?: string;
  });
  const semesterId = query.semesterId;

  const fetching = useAppSelector((state) => state.companies.fetching);
  const company = useAppSelector((state) =>
    selectTransformedAdminCompanyById(state, companyId),
  );

  const semesters = useAppSelector((state) =>
    selectCompanySemesterEntities<CompanySemester>(state),
  );
  const selectedSemester = semesterId ? semesters[semesterId] : undefined;

  const studentContacts =
    selectedSemester &&
    company?.studentContacts?.filter(
      (studentContact) =>
        studentContact.semester.semester == selectedSemester.semester &&
        studentContact.semester.year == selectedSemester.year,
    );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  usePreparedEffect(
    'fetchSemester',
    () =>
      companyId &&
      dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
    [companyId],
  );

  if (!company) {
    return <LoadingPage loading={fetching} />;
  }

  const onSubmit = async (formContent: FormValues) => {
    if (!companyId || !semesterId) return;

    const updatedStudentContactsForSemester = formContent.studentContacts.map(
      (studentContact) => ({
        company: Number(companyId),
        semester: Number(semesterId),
        user: studentContact.value,
      }),
    );

    const missingStudentContacts = company.studentContacts
      ?.filter((studentContact) => studentContact.semester.id != semesterId)
      .map((studentContact) => ({
        company: studentContact.company,
        user: studentContact.user.id,
        semester: studentContact.semester.id,
      }));

    const body = {
      studentContacts: [
        ...updatedStudentContactsForSemester,
        ...(missingStudentContacts ?? []),
      ],
      companyId: company.id,
    };

    await dispatch(editCompany(body));
    navigate(`/bdb/${companyId}`);
  };

  const initialValues =
    selectedSemester && semesterId
      ? {
          semesterId: {
            label: semesterToHumanReadable(
              selectedSemester.semester,
              selectedSemester.year,
            ),
            value: semesterId,
          },
          studentContacts: studentContacts?.map((studentContact) => ({
            label: `${studentContact.user.fullName} (${studentContact.user.username})`,
            value: studentContact.user.id,
          })),
        }
      : {};

  return (
    <Page title={title} back={{ href: `/bdb/${company.id}` }}>
      <TypedLegoForm onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="semesterId"
              label="Semester"
              onChange={({ value }) => setQueryValue('semesterId')(value)}
              component={SelectInput.Field}
              options={Object.entries(semesters).map(
                ([semesterId, semester]) => ({
                  label: semesterToHumanReadable(
                    semester.semester,
                    semester.year,
                  ),
                  value: semesterId,
                }),
              )}
              id="semesterId"
              required
            />

            <Field
              placeholder="Velg studentkontakter"
              name="studentContacts"
              label="Studentkontakter"
              component={SelectInput.AutocompleteField}
              isMulti
              filter={[AutocompleteContentType.User]}
              id="studentContacts"
              required
            />

            <SubmissionError />
            <SubmitButton>Lagre</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default StudentContactEditor;