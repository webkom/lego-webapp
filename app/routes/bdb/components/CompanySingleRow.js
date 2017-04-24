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
  changedStatuses: Array<Object>
};

export default class CompanySingleRow extends Component {
  props: Props;

  semesterElement = index => {
    const { startYear, startSem, company } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    const statuses = company.semesterStatuses;
    if (statuses) {
      return statuses.find(
        status =>
          status.year === result.year && status.semester === result.semester
      ) || { contactedStatus: 6 };
    }
    return { contactedStatus: 6 };
  };

  render() {
    const {
      company,
      editSemester,
      changedStatuses,
      startYear,
      startSem
    } = this.props;

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
        changedStatuses={changedStatuses}
        startYear={startYear}
        startSem={startSem}
      />
    ));

    return (
      <tr>
        <td><Link to={`/bdb/${company.id}`}>{company.name}</Link></td>
        {semesters}
        <td>
          {company.studentContact ? company.studentContact.fullName : ''}
        </td>
        <td className={styles.adminComment}>{company.adminComment}</td>
      </tr>
    );
  }
}
