import { Component } from 'react';
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
type State = {
  displayDropdown: boolean;
};
export default class SemesterStatus extends Component<Props, State> {
  state = {
    displayDropdown: false,
  };

  render() {
    const { semesterStatus, companyId, semIndex } = this.props;
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
            this.props.editChangedStatuses(
              companyId,
              semIndex,
              semesterStatus?.id,
              getContactStatuses(contactedStatuses, status),
            )
          }
        />
      </td>
    );
  }
}
