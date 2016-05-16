import styles from './bdb.css';
import React, { Component, PropTypes } from 'react';
import FieldError from 'app/components/FieldError';

export default class AddCompany extends Component {

  static propTypes = {
    addCompany: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  onSubmit({ name, studentContact, adminComment, jobOfferOnly, phone }) {
    this.props.addCompany({
      name,
      studentContact,
      adminComment,
      jobOfferOnly: jobOfferOnly || false,
      phone
    });
  }

  render() {
    const {
      fields: {
        name, studentContact, adminComment, jobOfferOnly, phone
      },
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <div className={styles.root}>

        <div>
          <h1>Legg til bedrift</h1>
        </div>

        <div>
          <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

            <label htmlFor='add-company-name' style={{ fontSize: 25 }}>
              Bedriftens navn <b>*</b>
            </label>
            {name.error && name.touched ?
              <FieldError error={name.error} /> : null}
            <input type='text' id='add-company-name' {...name} />

            <label htmlFor='add-company-student-contact' style={{ fontSize: 25 }}>
              Studentkontakt <b>*</b>
            </label>
            {studentContact.error && studentContact.touched ?
              <FieldError error={studentContact.error} /> : null}
            <input type='text' id='add-company-student-contact' {...studentContact} />

            <label htmlFor='add-company-admin-comment' style={{ fontSize: 20 }}>
              Kommentar for BedKom
            </label>
            <textarea id='add-company-admin-comment' {...adminComment} />

            <label htmlFor='add-company-phone' style={{ fontSize: 25 }}>
              Telefonnummer
            </label>
            <input type='text' id='add-company-phone' {...phone} />

            <div className={styles.checkBox}>
              <input type='checkbox' value='jobOfferOnly' id='add-company-job-only'
                {...jobOfferOnly}
              /> Lages denne bedriften kun for jobbtilbud?
            </div>

            <div className={styles.clear}></div>
            <input type='submit' className={styles.submit}
              value='Send inn' disabled = {disabledButton}
            />
          </form>
        </div>
      </div>
    );
  }
}
