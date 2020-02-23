// @flow

import React from 'react';
import type { FormProps } from 'redux-form';
import { reset } from 'redux-form';
import { Field } from 'redux-form';
import { Content } from 'app/components/Content';
import { semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import { Form } from 'app/components/Form';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import Flex from 'app/components/Layout/Flex';
import Icon from 'app/components/Icon';
import { TextInput, RadioButton, RadioButtonGroup } from 'app/components/Form';
import Button from 'app/components/Button';
import { legoForm } from 'app/components/Form/';
import { SemesterNavigation } from 'app/routes/companyInterest/utils';
import { createValidator, required } from 'app/utils/validation';

type Props = {
  onSubmit: CompanySemesterEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<CompanySemesterEntity>,
  autoFocus: any,
  edit: boolean,
  editSemester: CompanySemesterEntity => void
} & FormProps;

const CompanySemesterGUI = (props: Props) => {
  const activeSemesters = semesters => (
    <Flex column>
      {semesters.map((semester, index) => (
        <Flex key={index} className={styles.guiBoxes}>
          <div className={styles.checkboxSpan}>
            {semesterToText({ ...semester, language: 'norwegian' })}
          </div>
          <Icon
            name="close-circle"
            onClick={() =>
              props.editSemester({
                ...semester,
                activeInterestForm: false
              })
            }
            className={styles.remove}
          />
        </Flex>
      ))}
    </Flex>
  );

  const { handleSubmit, autoFocus } = props;

  return (
    <Content>
      <SemesterNavigation title="Endre aktive semestre" />
      <Form onSubmit={handleSubmit}>
        <Flex className={styles.guiWrapper}>
          <Flex column style={{ marginRight: '50px' }}>
            <label className={styles.heading}>Legg til aktivt semester</label>
            <Field
              autoFocus={autoFocus}
              placeholder="2020"
              label="År"
              name="year"
              type="number"
              component={TextInput.Field}
              className={styles.yearForm}
              required
            />
            <RadioButtonGroup name="semester" label="Semester">
              <Field
                name="Spring"
                label="Vår"
                component={RadioButton.Field}
                inputValue="spring"
              />
              <Field
                name="Autumn"
                label="Høst"
                component={RadioButton.Field}
                inputValue="autumn"
              />
            </RadioButtonGroup>
            <Button submit className={styles.submit}>
              Legg til semester
            </Button>
          </Flex>
          <Flex column>
            <label className={styles.heading}>Deaktiver semestre</label>
            {activeSemesters(props.activeSemesters)}
          </Flex>
        </Flex>
      </Form>
    </Content>
  );
};

const onSubmit = ({ year, semester }, dispatch, props: Props) => {
  const { semesters, addSemester, editSemester } = props;
  const existingCompanySemester = semesters.find(companySemester => {
    return (
      Number(companySemester.year) == Number(year) &&
      companySemester.semester == semester
    );
  });
  if (existingCompanySemester)
    return editSemester({
      ...existingCompanySemester,
      activeInterestForm: true
    });
  else return addSemester({ year, semester }); // Default is activeInterestForm: true
};

const validate = createValidator({
  year: [required()],
  semester: [required()]
});

export default legoForm({
  form: 'addCompanySemester',
  onSubmitSuccess: (result, dispatch) => dispatch(reset('addCompanySemester')),
  onSubmit,
  enableReinitialize: true,
  validate
})(CompanySemesterGUI);
