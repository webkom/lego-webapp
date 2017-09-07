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
  changedStatuses: Array<Object>,
  companySemesters: Array<Object>
};

export default class CompanySingleRow extends Component {
  props: Props;

  semesterElement = index => {
    const { startYear, startSem, company, companySemesters } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    console.log('result');
    console.log(result);

    return (
      (company.semesterStatuses || []).find(status => {
        const companySemester = (companySemesters || [])
          .find(semester => semester.id === status.semester);

        return companySemester === undefined
          ? { contactedStatus: ['not_contacted'] }
          : companySemester.year === result.year &&
            companySemester.semester === result.semester;
      }) || { contactedStatus: ['not_contacted'] }
    );
  };

  render() {
    const {
      company,
      editSemester,
      changedStatuses,
      startYear,
      startSem
    } = this.props;
    console.log(this.semesterElement(0));
    console.log('#');

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
        <td>
          <Link to={`/bdb/${company.id}`}>{company.name}</Link>
        </td>
        {semesters}
        <td>{company.studentContact ? company.studentContact.fullName : ''}</td>
        <td className={styles.adminComment}>{company.adminComment}</td>
      </tr>
    );
  }
}
