// @flow

import React from 'react';
import type { FieldProps } from 'redux-form';
import { Content } from 'app/components/Content';
import { semesterToText } from 'app/routes/companyInterest/components/companyInterestPage';
import styles from './CompanyInterest.css';
import { Form } from 'app/components/Form';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { FlexRow } from 'app/components/FlexBox';
import Icon from 'app/components/Icon';

type Props = FieldProps & {
  actionGrant: Array<String>,
  onSubmit: CompanySemesterEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<Object>,
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
      return toggleActiveSemester(existingCompanySemester.id);
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
  return (
    <Content>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <label className={styles.heading}>Legg til aktivt semester</label>
        <label className={styles.heading}>Deaktiver aktive semestre</label>
        {activeSemesters}
      </Form>
    </Content>
  );
};

export default CompanySemesterGUI;
