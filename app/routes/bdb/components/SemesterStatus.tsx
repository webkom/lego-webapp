import { Flex } from '@webkom/lego-bricks';
import { NonEventContactStatus } from 'app/store/models/Company';
import {
  getStatusColor,
  getContactStatuses,
  selectMostProminentStatus,
} from '../utils';
import styles from './SemesterStatus.css';
import SemesterStatusContent from './SemesterStatusContent';
import type {
  TransformedAdminCompany,
  TransformedSemesterStatus,
} from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';

type Props = {
  editChangedStatuses: (
    company: TransformedAdminCompany,
    contactedStatus: CompanySemesterContactStatus[],
  ) => Promise<unknown>;
  semesterStatus: TransformedSemesterStatus | undefined;
  company: TransformedAdminCompany;
};
const SemesterStatus = ({
  semesterStatus,
  company,
  editChangedStatuses,
}: Props) => {
  const contactedStatuses = semesterStatus?.contactedStatus ?? [
    NonEventContactStatus.NOT_CONTACTED,
  ];
  return (
    <Flex
      alignItems="center"
      className={styles.semesterStatus}
      style={{
        backgroundColor: getStatusColor(
          selectMostProminentStatus(contactedStatuses),
        ),
      }}
    >
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
