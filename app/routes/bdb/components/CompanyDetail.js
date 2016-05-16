import React, { Component, PropTypes } from 'react';
import styles from './bdb.css';
import { statusIntToString, selectColorCode } from '../utils.js';
import CompanyRightNav from './CompanyRightNav';

export default class CompanyDetail extends Component {

  static propTypes = {
    company: PropTypes.object.isRequired
  };

  render() {
    const { company } = this.props;

    // TODO: LoadingIndicator here
    if (!company) {
      return null;
    }

    const semesters = company.semesterStatuses.map((status, i) => (
      <tr key={i}>
        <td className={styles.title}>{status.semester} {status.year}</td>
        <td className={styles[selectColorCode(status.contactedStatus)]}>
          {statusIntToString(status.contactedStatus)}
        </td>
        <td> </td>
      </tr>
    )).sort((a, b) => a.year === b.year ? a.semester - b.semester : a.year - b.year);

    return (
      <div className={styles.root}>
          <h1>{company.name}</h1>

          <div className={styles.detail}>
          <div className={styles.leftSection}>
            <h3>Semesterstatuser</h3>
            <div className={styles.companyList}>
              <table className={styles.detailTable}>
                <thead className={styles.categoryHeader}>
                  <tr>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Kontrakt</th>
                  </tr>
                </thead>
                <tbody>
                  {semesters.reverse()}
                </tbody>
              </table>
            </div>

            <h3>Studentkontakt</h3>
            {company.studentContact}

            <h3>Kommentar fra Bedkom</h3>
            {company.adminComment}

            <h3>Telefonnummer</h3>
            {company.phone}

            <h3>Kommentar</h3>
            {company.comments ? company.comments : 'Ingen kommentar'}
          </div>

          <CompanyRightNav
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
