import { NonEventContactStatus } from 'app/store/models/Company';
import {
  getStatusColor,
  getContactStatuses,
  selectMostProminentStatus,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedSemesterStatus } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';

type Props = {
  semesterStatus: TransformedSemesterStatus | undefined;
  editChangedStatuses: (
    companyId: EntityId,
    tableIndex: number,
    semesterStatusId: EntityId | undefined,
    contactedStatus: CompanySemesterContactStatus[],
  ) => Promise<unknown>;
  companyId: EntityId;
  semIndex: number;
};
const SemesterStatus = ({
  semesterStatus,
  companyId,
  semIndex,
  editChangedStatuses,
}: Props) => {
  const contactedStatuses = semesterStatus?.contactedStatus ?? [
    NonEventContactStatus.NOT_CONTACTED,
  ];
  return (
    <td
      style={{
        padding: 0,
        backgroundColor: getStatusColor(
          selectMostProminentStatus(contactedStatuses),
        ),
      }}
    >
      <SemesterStatusContent
        contactedStatus={contactedStatuses}
        editFunction={(status) =>
          editChangedStatuses(
            companyId,
            semIndex,
            semesterStatus?.id,
            getContactStatuses(contactedStatuses, status),
          )
        }
      />
    </td>
  );
};

export default SemesterStatus;
