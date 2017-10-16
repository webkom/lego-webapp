import React, { Component } from 'react';
import { Link } from 'react-router';
import { indexToSemester } from '../utils.js';
import SemesterStatus from './SemesterStatus';
import styles from './bdb.css';

type Props = {
  company: Object,
  startYear: number,
  startSem: number,
  editSemester: () => void,
  companySemesters: Array<Object>
};

export default class CompanySingleRow extends Component {
  props: Props;

  semesterElement = index => {
    const { startYear, startSem, company } = this.props;
    const result = indexToSemester(index, startYear, startSem);

    return (
      (company.semesterStatuses || []).find(
        status =>
          status.year === result.year && status.semester === result.semester
      ) || { contactedStatus: ['not_contacted'] }
    );
  };

  render() {
    const { company, editSemester } = this.props;

    const semesters = [
      this.semesterElement(0),
      this.semesterElement(1),
      this.semesterElement(2)
    ].map((status, i) => (
      <SemesterStatus
        key={i}
        semIndex={i}
        semesterStatus={status}
        editSemester={editSemester}
        companyId={company.id}
      />
    ));

    return (
      <tr>
        <td>
          <Link to={`/bdb/${company.id}`}>{company.name}</Link>
        </td>
        {semesters}
        <td>
          {company.studentContact &&
            (typeof company.studentContact === 'string' ? (
              company.studentContact
            ) : (
              <Link to={`/users/${company.studentContact.username}`}>
                {company.studentContact.fullName}
              </Link>
            ))}
        </td>
        <td className={styles.adminComment}>{company.adminComment}</td>
      </tr>
    );
  }
}
