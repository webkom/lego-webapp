import styles from './bdb.css';
import React, { Component, PropTypes } from 'react';
import FieldError from 'app/components/FieldError';

export default class editCompany extends Component {

  static propTypes = {
    editCompany: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    company: PropTypes.object.isRequired,
    companyId: PropTypes.string.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  onSubmit({ name = this.props.company.name, studentContact = this.props.company.studentContact,
    adminComment, jobOfferOnly, phone }) {
    this.props.editCompany({
      companyId: this.props.companyId,
      name,
      studentContact,
      adminComment,
      jobOfferOnly: jobOfferOnly || false,
      phone
    });
  }

  render() {
    const {
      company,
      fields: {
        name, studentContact, adminComment, jobOfferOnly, phone
      },
      submitting
    } = this.props;

    if (!company) {
      return (
        <div className={styles.root}>
          Laster...
        </div>
      );
    }
    return (
      <div className={styles.root}>

        <div>
          <h1>Endre bedrift</h1>
        </div>

        <div>
          <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

            <label htmlFor='edit-company-name' style={{ fontSize: 25 }}>
              Bedriftens navn
            </label>
            {name.error && name.touched ?
              <FieldError error={name.error} /> : null}
            <input type='text' id='edit-company-name' {...name} />

            <label htmlFor='edit-company-student-contact' style={{ fontSize: 25 }}>
              Studentkontakt
            </label>
            {studentContact.error && studentContact.touched ?
              <FieldError error={studentContact.error} /> : null}
            <input type='text' id='edit-company-student-contact'
              {...studentContact}
            />

            <label htmlFor='edit-company-admin-comment' style={{ fontSize: 20 }}>
              Kommentar for BedKom
            </label>
            <textarea id='edit-company-admin-comment'
              {...adminComment}
            />

            <label htmlFor='edit-company-phone' style={{ fontSize: 25 }}>
              Telefonnummer
            </label>
            <input type='text' id='edit-company-phone' {...phone} />

            <div className={styles.checkBox}>
              <input type='checkbox' value='jobOfferOnly' id='edit-company-job-only'
                {...jobOfferOnly}
              /> Lages denne bedriften kun for jobbtilbud?
            </div>

            <div className={styles.clear}></div>
            <input type='submit' className={styles.submit}
              value='Send inn' disabled = {submitting}
            />
          </form>
        </div>
      </div>
    );
  }
}
