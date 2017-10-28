// @flow

import styles from './bdb.css';
import React, { Component } from 'react';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, RadioButton, RadioButtonGroup } from 'app/components/Form';
import SemesterStatusContent from './SemesterStatusContent';
import {
  getContactedStatuses,
  selectMostProminentStatus,
  selectColorCode,
  DetailNavigation
} from '../utils';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { SemesterStatusEntity } from 'app/reducers/companies';

import type { CompanySemesterContactedStatus } from 'app/models';

type Props = {
  addSemesterStatus: (Object, ?Object) => Promise<*>,
  handleSubmit: ((Object) => ?Promise<*>) => void,
  companyId: number,
  submitting: boolean,
  autoFocus: any,
  companySemesters: Array<Object>,
  addSemester: CompanySemesterEntity => Promise<*>,
  deleteCompany: number => Promise<*>
};

type State = {
  contactedStatus: Array</*TODO: ContactedStatus */ any>,
  submit: boolean
};

export default class AddSemester extends Component<Props, State> {
  state = {
    contactedStatus: [],
    submit: false
  };

  onSubmit = ({ year, semester, contract }: SemesterStatusEntity) => {
    if (!this.state.submit) return;
    const {
      companyId,
      addSemesterStatus,
      companySemesters,
      addSemester
    } = this.props;

    const { contactedStatus } = this.state;

    const globalSemester = companySemesters.find(companySemester => {
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
          contract
        },
        { detail: true }
      );
    } else {
      return addSemester(({ year, semester }: Object)).then(response => {
        addSemesterStatus(
          {
            companyId,
            semester: response.payload.id,
            contactedStatus,
            contract
          },
          { detail: true }
        );
      });
    }
  };

  setContactedStatus = (event: Object) => {
    this.setState({ contactedStatus: event.target.value });
  };

  editFunction = (statusString: CompanySemesterContactedStatus) => {
    this.setState({
      contactedStatus: getContactedStatuses(
        this.state.contactedStatus,
        statusString
      )
    });
  };

  render() {
    const {
      companyId,
      submitting,
      autoFocus,
      handleSubmit,
      deleteCompany
    } = this.props;

    const semesterStatus = { contactedStatus: this.state.contactedStatus };

    return (
      <div className={styles.root}>
        <DetailNavigation
          title="Legg til semester"
          companyId={companyId}
          deleteFunction={deleteCompany}
        />

        <div className={styles.detail}>
          <i style={{ display: 'block', marginBottom: '10px' }}>
            <b>Hint:</b> du kan legge til status for flere semestere samtidig på
            Bdb-forsiden!
          </i>

          <form onSubmit={handleSubmit(this.onSubmit)}>
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

            <label>Status</label>
            <div
              style={{
                width: '200px',
                minHeight: '30px',
                margin: '15px 0 25px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
              type="button"
              className={
                styles[
                  selectColorCode(
                    selectMostProminentStatus(semesterStatus.contactedStatus)
                  )
                ]
              }
            >
              <SemesterStatusContent
                semesterStatus={semesterStatus}
                submit={false}
                editFunction={statusCode => this.editFunction(statusCode)}
                style={{
                  minHeight: '30px',
                  padding: '10px'
                }}
              />
            </div>

            <div className={styles.clear} />

            <Button
              className={styles.submit}
              disabled={submitting}
              onClick={() => this.setState({ submit: true })}
              submit
            >
              Lagre
            </Button>
          </form>
        </div>
      </div>
    );
  }
}
