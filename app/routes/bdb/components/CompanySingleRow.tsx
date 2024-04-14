import { Link } from 'react-router-dom';
import { selectUserById } from 'app/reducers/users';
import { useAppSelector } from 'app/store/hooks';
import { type CompanySemesterContactStatus } from 'app/store/models/Company';
import { indexToYearAndSemester } from '../utils';
import SemesterStatus from './SemesterStatus';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedAdminCompany } from 'app/reducers/companies';

type Props = {
  company: TransformedAdminCompany;
  startYear: number;
  startSem: number;
  editChangedStatuses: (
    companyId: EntityId,
    tableIndex: number,
    semesterStatusId: EntityId | undefined,
    contactedStatus: CompanySemesterContactStatus[],
  ) => Promise<unknown>;
};
const CompanySingleRow = ({
  company,
  editChangedStatuses,
  startYear,
  startSem,
}: Props) => {
  const studentContact = useAppSelector((state) =>
    company.studentContact !== null
      ? selectUserById(state, company.studentContact)
      : undefined,
  );

  const semesterElement = (index: number) => {
    const result = indexToYearAndSemester(index, startYear, startSem);
    return (company.semesterStatuses || []).find(
      (status) =>
        status.year === result.year && status.semester === result.semester,
    );
  };

  const semesters = [
    semesterElement(0),
    semesterElement(1),
    semesterElement(2),
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
        {studentContact && (
          <Link to={`/users/${studentContact.username}`}>
            {studentContact.fullName}
          </Link>
        )}
      </td>
      <td>{company.adminComment}</td>
    </tr>
  );
};

export default CompanySingleRow;
