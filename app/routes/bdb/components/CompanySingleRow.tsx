import { Component } from 'react';
import { Link } from 'react-router-dom';
import { indexToSemester } from '../utils';
import SemesterStatus from './SemesterStatus';
import styles from './bdb.css';
import type { CompanySemesterContactedStatus } from 'app/models';

type Props = {
  company: Record<string, any>;
  startYear: number;
  startSem: number;
  editChangedStatuses: (
    arg0: number,
    arg1: number,
    arg2: number | null | undefined,
    arg3: Array<CompanySemesterContactedStatus>,
  ) => Promise<any> | null | undefined;
};
export default class CompanySingleRow extends Component<Props> {
  semesterElement = (index: number) => {
    const { startYear, startSem, company } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    return (
      (company.semesterStatuses || []).find(
        (status) =>
          status.year === result.year && status.semester === result.semester,
      ) || {
        contactedStatus: ['not_contacted'],
      }
    );
  };

  render() {
    const { company, editChangedStatuses } = this.props;
    const semesters = [
      this.semesterElement(0),
      this.semesterElement(1),
      this.semesterElement(2),
    ].map((status, i) => (
      <SemesterStatus
        key={i}
        semIndex={i}
        semesterStatus={status}
        editChangedStatuses={editChangedStatuses}
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
