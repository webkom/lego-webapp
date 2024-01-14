import { Component } from 'react';
import {
  getStatusColor,
  getContactStatuses,
  selectMostProminentStatus,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import type { BaseSemesterStatusEntity } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';

type Props = {
  semesterStatus: BaseSemesterStatusEntity;
  editChangedStatuses: (
    arg0: number,
    arg1: number,
    arg2: number | null | undefined,
    arg3: Array<CompanySemesterContactStatus>
  ) => any;
  companyId: number;
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
    return (
      <td
        style={{
          padding: 0,
          backgroundColor: getStatusColor(
            selectMostProminentStatus(semesterStatus.contactedStatus)
          ),
        }}
      >
        <SemesterStatusContent
          semesterStatus={semesterStatus}
          editFunction={(status) =>
            this.props.editChangedStatuses(
              companyId,
              semIndex,
              semesterStatus.id,
              getContactStatuses(semesterStatus.contactedStatus, status)
            )
          }
        />
      </td>
    );
  }
}
