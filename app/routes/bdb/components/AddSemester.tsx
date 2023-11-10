import { useState } from 'react';
import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import { TextInput, RadioButton, MultiSelectGroup } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { createValidator, required } from 'app/utils/validation';
import {
  getContactedStatuses,
  selectMostProminentStatus,
  selectColorCode,
  DetailNavigation,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';
import type { SemesterStatusEntity } from 'app/reducers/companies';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

type Props = {
  addSemesterStatus: (
    arg0: Record<string, any>,
    arg1: Record<string, any> | null | undefined,
  ) => Promise<any>;
  companyId: number;
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
  const [submit, setSubmit] = useState(false);

  const onSubmit = ({
    year,
    semester,
    contract,
    semesterStatus,
  }: SemesterStatusEntity) => {
    const contactedStatus = semesterStatus.contactedStatus;
    if (!submit) return;
    const { companyId, addSemesterStatus, companySemesters, addSemester } =
      props;
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
        },
      );
    } else {
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
          },
        );
      });
    }
  };

  const { companyId, autoFocus, deleteCompany } = props;

  return (
    <Content>
      <DetailNavigation
        title="Legg til semester"
        companyId={companyId}
        deleteFunction={deleteCompany}
      />

      <div className={styles.detail}>
        <i
          style={{
            display: 'block',
            marginBottom: '10px',
          }}
        >
          <b>Hint:</b> du kan legge til status for flere semestere samtidig på
          Bdb-forsiden!
        </i>

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
                          selectMostProminentStatus(
                            input.value.contactedStatus,
                          ),
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
                            statusString,
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
