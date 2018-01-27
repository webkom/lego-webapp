// @flow

import React from 'react';
import type { FieldProps } from 'redux-form';
import { Field } from 'redux-form';
import { Content } from 'app/components/Content';
import { semesterToText } from 'app/routes/companyInterest/components/companyInterestPage';
import styles from './CompanyInterest.css';
import { Form } from 'app/components/Form';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { FlexRow } from 'app/components/FlexBox';
import Icon from 'app/components/Icon';
import { TextInput, RadioButton, RadioButtonGroup } from 'app/components/Form';

type Props = FieldProps & {
  actionGrant: Array<String>,
  onSubmit: CompanySemesterEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<Object>,
  autoFocus: any,
  edit: boolean,
  toggleActiveSemester: (Array<Object>) => void
};

const CompanySemesterGUI = (props: Props) => {
  const onSubmit = ({ year, semester }: CompanySemesterEntity) => {
    const { companySemesters, addSemester, toggleActiveSemester } = props;
    const existingCompanySemester = companySemesters.find(companySemester => {
      return (
        companySemester.year == Number(year) &&
        companySemester.semester == semester
      );
    });

    if (existingCompanySemester) {
      return toggleActiveSemester(existingCompanySemester);
    } else {
      return addSemester({ year, semester }); // Default is activeInterestForm: true
    }
  };

  const activeSemesters = semesters => (
    <FlexRow className={styles.checkboxWrapper}>
      {semesters.map((semester, index) => (
        <div key={index} className={styles.checkbox}>
          <Icon
            name="close-circle"
            onClick={() => props.toggleActiveSemester(semester.id)}
            className={styles.remove}
          />
          <span className={styles.checkboxSpan}>
            {semesterToText(semester)}
          </span>
        </div>
      ))}
    </FlexRow>
  );

  const { autoFocus } = props;

  return (
    <Content>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <label className={styles.heading}>Legg til aktivt semester</label>
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
          <RadioButtonGroup name="semester" label="Semester">
            <Field
              label="Vår"
              component={RadioButton.Field}
              inputValue="spring"
            />
            <Field
              label="Høst"
              component={RadioButton.Field}
              inputValue="autumn"
            />
          </RadioButtonGroup>
        </div>
        <label className={styles.heading}>Deaktiver semestre</label>
        {activeSemesters}
      </Form>
    </Content>
  );
};

export default CompanySemesterGUI;
