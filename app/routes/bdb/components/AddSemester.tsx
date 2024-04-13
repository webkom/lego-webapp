import { Card } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
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
import { Content } from 'app/components/Content';
import { TextInput, RadioButton, MultiSelectGroup } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import {
  selectCompanyById,
  type SemesterStatusEntity,
} from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import {
  semesterCodeToName,
  getContactStatuses,
  getStatusColor,
  selectMostProminentStatus,
  DetailNavigation,
} from 'app/routes/bdb/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import styles from './AddSemester.css';
import SemesterStatusContent from './SemesterStatusContent';

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const AddSemester = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useAppSelector((state) =>
    selectCompanyById(state, companyId),
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
    semester: string;
    year: number;
  } | null>(null);

  const onSubmit = ({
    year,
    semester,
    contract,
    semesterStatus,
  }: SemesterStatusEntity) => {
    const contactedStatus = semesterStatus.contactedStatus;

    if (!submit) return;

    const foundSemesterStatus =
      company &&
      company.semesterStatuses.find((semesterStatus) => {
        return (
          semesterStatus.year === year && semesterStatus.semester === semester
        );
      });

    if (foundSemesterStatus) {
      setFoundSemesterStatus({ semester, year });
      return;
    } else {
      setFoundSemesterStatus(null);
    }

    const globalSemester = companySemesters.find((companySemester) => {
      return (
        companySemester.year === Number(year) &&
        companySemester.semester === semester
      );
    });

    if (globalSemester) {
      return dispatch(
        addSemesterStatus({
          companyId,
          semester: globalSemester.id,
          contactedStatus,
          contract,
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
          semester: response.payload.id,
          contactedStatus,
          contract,
        }),
      ).then(() => {
        navigate(`/bdb/${companyId}/`);
      });
    });
  };

  const initialValues = companyId
    ? {
        year: moment().year(),
        semester: 0,
        contactedStatus: 'not_contacted',
        semesterStatus: {
          contactedStatus: [],
        },
      }
    : {
        semesterStatus: {
          contactedStatus: [],
        },
      };

  return (
    <Content>
      <DetailNavigation title="Legg til semester" companyId={companyId} />

      <div>
        <Card severity="info">
          <Card.Header>Hint</Card.Header>
          <span>
            Du kan legge til status for flere semestere samtidig på
            Bdb-forsiden!
          </span>
        </Card>

        <LegoFinalForm
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
                      semesterStatus={input.value}
                      editFunction={(status) => {
                        input.onChange({
                          contactedStatus: getContactStatuses(
                            input.value.contactedStatus,
                            status,
                          ),
                        });
                      }}
                      style={{
                        minHeight: '30px',
                        padding: '10px',
                      }}
                    />
                  </div>
                )}
              </Field>

              <div className={styles.clear} />

              {!isEmpty(foundSemesterStatus) && (
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
              <SubmitButton onClick={() => setSubmit(true)}>
                Legg til
              </SubmitButton>
            </form>
          )}
        </LegoFinalForm>
      </div>
    </Content>
  );
};

export default guardLogin(AddSemester);
