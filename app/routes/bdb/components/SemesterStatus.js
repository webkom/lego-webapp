// @flow

import { Component } from 'react';

import type { CompanySemesterContactedStatus } from 'app/models';
import type { BaseSemesterStatusEntity } from 'app/reducers/companies';
import {
  getContactedStatuses,
  selectColorCode,
  selectMostProminentStatus,
} from '../utils.js';
import SemesterStatusContent from './SemesterStatusContent';

import styles from './bdb.css';

type Props = {
  semesterStatus: BaseSemesterStatusEntity,
  editChangedStatuses: (
    number,
    number,
    ?number,
    Array<CompanySemesterContactedStatus>
  ) => any,
  companyId: number,
  semIndex: number,
};

type State = {
  displayDropdown: boolean,
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
              selectMostProminentStatus(semesterStatus.contactedStatus)
            )
          ]
        }
        style={{ padding: 0 }}
      >
        <SemesterStatusContent
          semesterStatus={semesterStatus}
          editFunction={(statusString) =>
            this.props.editChangedStatuses(
              companyId,
              semIndex,
              semesterStatus.id,
              getContactedStatuses(semesterStatus.contactedStatus, statusString)
            )
          }
        />
      </td>
    );
  }
}
