import styles from './bdb.css';
import React, { Component } from 'react';
import CompanyRightNav from './CompanyRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import { selectColorCode, statusStrings } from '../utils.js';
import cx from 'classnames';
import { Link } from 'react-router';

type Props = {
  addSemester: () => void,
  handleSubmit: () => void,
  companyId: string,
  fields: any,
  submitting: boolean,
  autoFocus: any
};

export default class AddSemester extends Component {

  state = {
    contactedStatus: 6
  }

  onSubmit({ year, semester, value }) {
    this.props.addCompany({
      companyId: this.props.company.id,
      year,
      semester,
      contactedStatus: value
    });
  }

  handleChange = (event) => {
    this.setState({
      contactedStatus: event.target.value
    });
  }

  props: Props;

  render() {
    const {
      companyId,
      submitting,
      autoFocus
    } = this.props;

    return (
      <div className={styles.root}>

        <h1>Legg til semester</h1>
        <i><Link to={`/bdb/${companyId}`}>Tilbake til bedriften</Link></i>
        <br />

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

              <Field
                placeholder={'År'}
                autoFocus={autoFocus}
                name='year'
                component={TextInput.Field}
                className={styles.yearForm}
              />

              <h3>Semester</h3>
              <div className={styles.editInfo}>
                <input type='radio' name='semester' value={0} />
                  Vår
              </div>
              <div className={styles.editInfo}>
                <input type='radio' name='semester' value={1} />
                  Høst
              </div>

              <div className={cx(styles[selectColorCode(this.state.contactedStatus)],
                styles.semesterStatusForm)}
              >
                <select
                  name={'contactedStatus'}
                  value={this.state.contactedStatus}
                  onChange={this.handleChange}
                >
                  {Object.keys(statusStrings).map((statusString, j) => (
                    <option key={j} value={statusString}>{statusStrings[j]}</option>
                  ))}
                </select>
              </div>

              <Field
                placeholder={'Kontrakt for dette semesteret'}
                autoFocus={autoFocus}
                name='contract'
                component={TextInput.Field}
                className={styles.contractForm}
              />

              <div className={styles.clear}></div>
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

          <CompanyRightNav
            {...this.props}
          />

        </div>
      </div>
    );
  }
}
