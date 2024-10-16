import { Flex } from '@webkom/lego-bricks';
import { useMemo } from 'react';
import {
  addSemesterStatus,
  editSemesterStatus,
} from 'app/actions/CompanyActions';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { NonEventContactStatus } from 'app/store/models/Company';
import { getContactStatuses, getSemesterStatus } from '../utils';
import styles from './SemesterStatus.css';
import SemesterStatusContent from './SemesterStatusContent';
import type { Semester } from 'app/models';
import type {
  TransformedAdminCompany,
  TransformedSemesterStatus,
} from 'app/reducers/companies';
import type {
  AdminDetailCompany,
  AdminListCompany,
  CompanySemesterContactStatus,
} from 'app/store/models/Company';

type Props = {
  semesterStatus: TransformedSemesterStatus | undefined;
  semester: { semester: Semester; year: number } | undefined;
  company: TransformedAdminCompany;
};
const SemesterStatus = ({ semesterStatus, semester, company }: Props) => {
  const contactedStatuses = semesterStatus?.contactedStatus ?? [
    NonEventContactStatus.NOT_CONTACTED,
  ];

  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const companySemester = useMemo(
    () =>
      companySemesters.find(
        (companySemester) =>
          companySemester.semester === semester?.semester &&
          companySemester.year === semester?.year,
      ),
    [semester?.semester, semester?.year, companySemesters],
  );

  const dispatch = useAppDispatch();
  const editChangedStatuses = async (
    company: TransformedAdminCompany<AdminListCompany | AdminDetailCompany>,
    contactedStatus: CompanySemesterContactStatus[],
  ) => {
    if (!companySemester) {
      return;
    }

    const semesterStatus = {
      companyId: company.id,
      contactedStatus,
      semester: companySemester.id,
    };

    const semesterStatusId = getSemesterStatus(company, companySemester)?.id;

    return semesterStatusId
      ? dispatch(editSemesterStatus({ ...semesterStatus, semesterStatusId }))
      : dispatch(addSemesterStatus(semesterStatus));
  };

  return (
    <Flex alignItems="center" className={styles.semesterStatus}>
      <SemesterStatusContent
        contactedStatus={contactedStatuses}
        editFunction={(status) =>
          editChangedStatuses(
            company,
            getContactStatuses(contactedStatuses, status),
          )
        }
      />
    </Flex>
  );
};

export default SemesterStatus;
