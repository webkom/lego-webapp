import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, RadioButton, SelectInput } from 'app/components/Form';
import { selectColorCode, statusStrings } from '../utils.js';
import cx from 'classnames';

type Props = {
  addSemesterStatus: () => void,
  handleSubmit: () => void,
  companyId: string,
  submitting: boolean,
  autoFocus: any
};

export default class AddSemester extends Component {
  onSubmit = ({ contactedStatus, year, contract = '', semester }) => {
    const { companyId, addSemesterStatus } = this.props;
    addSemesterStatus(
      {
        companyId,
        year,
        semester,
        contactedStatus,
        contract
      },
      true
    );
  };

  setSemester = semester => {
    this.setState({ semester });
  };

  setContactedStatus = event => {
    this.setState({ contactedStatus: event.target.value });
  };

  props: Props;

  render() {
    const { companyId, submitting, autoFocus, handleSubmit } = this.props;
    return (
      <div className={styles.root}>
        <h1>Legg til semester</h1>

        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <i style={{ display: 'block', marginBottom: '10px' }}>
              Hint: du kan legge til status for flere semestere samtidig på
              Bdb-forsiden!
            </i>

            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                autoFocus={autoFocus}
                placeholder="År"
                name="year"
                type="number"
                component={TextInput.Field}
                className={styles.yearForm}
              />

              <div className={styles.choices}>
                <h3>Semester</h3>
                <div className={styles.editInfo}>
                  <label>
                    <Field
                      name="semester"
                      component={RadioButton.Field}
                      fieldStyle={{ width: '24px', marginBottom: 0 }}
                      inputValue={0}
                    />
                    Vår
                  </label>
                </div>
                <div className={styles.editInfo}>
                  <label>
                    <Field
                      name="semester"
                      component={RadioButton.Field}
                      fieldStyle={{ width: '24px', marginBottom: 0 }}
                      inputValue={1}
                    />
                    Høst
                  </label>
                </div>
              </div>

              <Field
                name="contactedStatus"
                simpleValue
                className={styles.contactedStatusForm}
                component={SelectInput.Field}
                options={Object.keys(statusStrings).map(index => ({
                  label: statusStrings[index],
                  value: Number(index)
                }))}
                placeholder="Status"
              />

              <Field
                placeholder={'Kontrakt for dette semesteret'}
                autoFocus={autoFocus}
                name="contract"
                component={TextInput.Field}
                className={styles.contractForm}
              />

              <div className={styles.clear} />

              <Button
                className={styles.submit}
                disabled={submitting}
                submit
                style={{ marginBottom: '0!important' }}
              >
                Lagre
              </Button>
            </form>
          </div>

          <BdbRightNav {...this.props} companyId={companyId} />
        </div>
      </div>
    );
  }
}
