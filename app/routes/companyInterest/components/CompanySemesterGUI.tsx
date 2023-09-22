import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import {
  addSemester,
  editSemester,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { Content } from 'app/components/Content';
import {
  Form,
  TextInput,
  RadioButton,
  RadioButtonGroup,
  LegoFinalForm,
} from 'app/components/Form';
import {
  selectCompanySemesters,
  selectCompanySemestersForInterestForm,
} from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import { semesterToText, SemesterNavigation } from '../utils';
import styles from './CompanyInterest.css';

const validate = createValidator({
  year: [required()],
  semester: [required()],
});

const CompanySemesterGUI = () => {
  const semesters = useAppSelector((state) => selectCompanySemesters(state));
  const activeSemesters = useAppSelector((state) =>
    selectCompanySemestersForInterestForm(state)
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSemesters());
  }, [dispatch]);

  const onSubmit = (values, form) => {
    const existingCompanySemester = semesters.find((companySemester) => {
      return (
        Number(companySemester.year) === Number(values.year) &&
        companySemester.semester === values.semester
      );
    });

    // Default is activeInterestForm: true
    if (existingCompanySemester) {
      dispatch(
        editSemester({
          ...existingCompanySemester,
          activeInterestForm: true,
        })
      );
    } else {
      dispatch(
        addSemester({
          year: values.year,
          semester: values.semester,
        })
      );
    }

    form.reset();
  };

  const initialValues = {
    semester: 'spring',
  };

  return (
    <Content>
      <SemesterNavigation title="Endre aktive semestre" />
      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        validateOnSubmitOnly
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex className={styles.guiWrapper}>
              <Flex
                column
                style={{
                  marginRight: '50px',
                }}
              >
                <label className={styles.heading}>
                  Legg til aktivt semester
                </label>
                <Field
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
                <Button submit>Legg til semester</Button>
              </Flex>
              <Flex column>
                <label className={styles.heading}>Deaktiver semestre</label>
                <Flex column>
                  {activeSemesters.map((semester, index) => (
                    <Flex key={index} className={styles.guiBoxes}>
                      <div className={styles.checkboxSpan}>
                        {semesterToText({ ...semester, language: 'norwegian' })}
                      </div>
                      <Icon
                        name="close"
                        onClick={() =>
                          dispatch(
                            editSemester({
                              ...semester,
                              activeInterestForm: false,
                            })
                          )
                        }
                        className={styles.remove}
                      />
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default CompanySemesterGUI;
