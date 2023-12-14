import { Card } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { useParams } from 'react-router';
import { Content } from 'app/components/Content';
import { TextInput, RadioButton, MultiSelectGroup } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import {
  selectCompanyById,
  type SemesterStatusEntity,
} from 'app/reducers/companies';
import {
  semesterCodeToName,
  getContactedStatuses,
  selectMostProminentStatus,
  selectColorCode,
  DetailNavigation,
} from 'app/routes/bdb/utils';
import { useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

type Props = {
  addSemesterStatus: (
    arg0: Record<string, any>,
    arg1: Record<string, any> | null | undefined
  ) => Promise<any>;
  autoFocus: any;
  companySemesters: Array<Record<string, any>>;
  addSemester: (arg0: CompanySemesterEntity) => Promise<any>;
  deleteCompany: (arg0: number) => Promise<any>;
};

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const AddSemester = (props: Props) => {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useAppSelector((state) =>
    selectCompanyById(state, { companyId })
  );

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

    const { addSemesterStatus, companySemesters, addSemester } = props;

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
      return addSemesterStatus(
        {
          companyId,
          semester: globalSemester.id,
          contactedStatus,
          contract,
        },
        {
          detail: true,
        }
      );
    }

    return addSemester({
      year,
      semester,
    }).then((response) => {
      addSemesterStatus(
        {
          companyId,
          semester: response.payload.id,
          contactedStatus,
          contract,
        },
        {
          detail: true,
        }
      );
    });
  };

  const { autoFocus } = props;

  return (
    <Content>
      <DetailNavigation
        title="Legg til semester"
        companyId={companyId}
        deleteFunction={deleteCompany}
      />

      <div className={styles.detail}>
        <Card severity="info">
          <Card.Header>Hint</Card.Header>
          <span>
            Du kan legge til status for flere semestere samtidig på
            Bdb-forsiden!
          </span>
        </Card>

        {!isEmpty(foundSemesterStatus) && (
          <Card severity="danger">
            <Card.Header>Feil</Card.Header>
            <span>
              Denne bedriften har allerede en registrert semester status for
              {semesterCodeToName(foundSemesterStatus.semester)}{' '}
              {foundSemesterStatus.year}. Du kan endre den på bedriftens side.
            </span>
          </Card>
        )}

        <LegoFinalForm
          onSubmit={onSubmit}
          validate={validate}
          initialValues={{
            semesterStatus: {
              contactedStatus: [],
            },
          }}
          subscription={{}}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field
                autoFocus={autoFocus}
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
                    component={RadioButton.Field}
                    inputValue="spring"
                    showErrors={false}
                  />
                  <Field
                    name="Autumn"
                    label="Høst"
                    component={RadioButton.Field}
                    inputValue="autumn"
                    showErrors={false}
                  />
                </MultiSelectGroup>
              </div>

              <label>Status</label>

              <Field name="semesterStatus">
                {({ input }) => (
                  <div
                    style={{
                      width: '200px',
                      minHeight: '30px',
                      margin: '15px 0 25px',
                      borderRadius: '5px',
                      border: '1px solid var(--border-gray)',
                    }}
                    className={
                      styles[
                        selectColorCode(
                          selectMostProminentStatus(input.value.contactedStatus)
                        )
                      ]
                    }
                  >
                    <SemesterStatusContent
                      semesterStatus={input.value}
                      editFunction={(statusString) => {
                        input.onChange({
                          contactedStatus: getContactedStatuses(
                            input.value.contactedStatus,
                            statusString
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

              <SubmissionError />
              <SubmitButton onClick={() => setSubmit(true)}>Lagre</SubmitButton>
            </form>
          )}
        </LegoFinalForm>
      </div>
    </Content>
  );
};

export default AddSemester;
