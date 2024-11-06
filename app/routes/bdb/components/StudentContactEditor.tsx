import { LoadingPage, Page } from "@webkom/lego-bricks";
import { LegoFinalForm, SelectInput, SubmissionError, SubmitButton } from "app/components/Form";
import { selectCompanyById, selectTransformedAdminCompanyById } from "app/reducers/companies";
import { selectCompanySemesterEntities } from "app/reducers/companySemesters";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import { AdminDetailCompany, StudentCompanyContact } from "app/store/models/Company";
import CompanySemester from "app/store/models/CompanySemester";
import { Field } from "react-final-form";
import { useNavigate, useParams } from "react-router-dom";
import { semesterToHumanReadable } from "../utils";
import { usePreparedEffect } from "@webkom/react-prepare";
import { editCompany, fetchAdmin, fetchSemesters } from "app/actions/CompanyActions";
import useQuery from "app/utils/useQuery";
import { EntityId } from "@reduxjs/toolkit";

export type FormValues = {
  semesterId: {label: string, value: string};
  studentContacts: {label: string, value: EntityId}[];
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const StudentContactEditor = () => {
  const title = 'Rediger studentkontakter'

  const { companyId } = useParams<{
    companyId: string;
  }>();

  const { query, setQueryValue } = useQuery({semesterId: undefined} as {semesterId?: string});
  const semesterId = query.semesterId;

  const fetching = useAppSelector((state) => state.companies.fetching);
  const company = useAppSelector((state) =>
    selectTransformedAdminCompanyById(state, companyId),
  );

  const semesters = useAppSelector((state) => selectCompanySemesterEntities<CompanySemester>(state));
  const selectedSemester = semesterId ? semesters[semesterId] : undefined;

  const studentContacts = selectedSemester && company?.studentContacts?.filter(
    (studentContact) => studentContact.semester.semester == selectedSemester.semester && studentContact.semester.year == selectedSemester.year
  )

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSemesterChange = ({value}: {label: string, value: string}) => {
    setQueryValue("semesterId")(value);
  }

  usePreparedEffect(
    'fetchSemester',
    () =>
      companyId && dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
    [companyId],
  );

  if (!company) {
    return <LoadingPage loading={fetching} />;
  }

  const onSubmit = async (formContent: FormValues) => {
    const body = {
      ...formContent,
      companyId: company.id,
    };

    await dispatch(editCompany(body));
    navigate(`/bdb/${companyId}`);
  };

  const initialValues = (selectedSemester && semesterId) ? {
      semesterId: {label: semesterToHumanReadable(selectedSemester.semester, selectedSemester.year), value: semesterId},
      studentContacts: studentContacts?.map(studentContact => ({label: `${studentContact.user.fullName} (${studentContact.user.username})`, value: studentContact.user.id}))
    } : {}

  return (
    <Page
      title={title}
      back={{ href: `/bdb/${company.id}` }}
    >
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="semesterId"
              label="Semester"
              onChange={onSemesterChange}
              component={SelectInput.Field}
              options={Object.entries(semesters).map(([semesterId, semester]) => ({
                label: semesterToHumanReadable(semester.semester, semester.year),
                value: semesterId,
              }))}
              id="semesterId"
              required
            />

            <Field
              placeholder="Velg student kontakter"
              name="studentContacts"
              label="Studentkontakter"
              component={SelectInput.AutocompleteField}
              isMulti
              filter={['users.user']}
              id="student-contacts"
              required
            />

            <SubmissionError />
            <SubmitButton>Lagre</SubmitButton>
          </form>
        )}
      </TypedLegoForm>
    </Page>
  );
}

export default StudentContactEditor;
