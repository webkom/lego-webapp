import { Component } from 'react';
import {
  selectColorCode,
  selectMostProminentStatus,
  getContactedStatuses,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';
import type { CompanySemesterContactedStatus } from 'app/models';
import type { BaseSemesterStatusEntity } from 'app/reducers/companies';

type Props = {
  semesterStatus: BaseSemesterStatusEntity;
  editChangedStatuses: (
    arg0: number,
    arg1: number,
    arg2: number | null | undefined,
    arg3: Array<CompanySemesterContactedStatus>,
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
        className={
          styles[
            selectColorCode(
              selectMostProminentStatus(semesterStatus.contactedStatus),
            )
          ]
        }
        style={{
          padding: 0,
        }}
      >
        <SemesterStatusContent
          semesterStatus={semesterStatus}
          editFunction={(statusString) =>
            this.props.editChangedStatuses(
              companyId,
              semIndex,
              semesterStatus.id,
              getContactedStatuses(
                semesterStatus.contactedStatus,
                statusString,
              ),
            )
          }
        />
      </td>
    );
  }
}
