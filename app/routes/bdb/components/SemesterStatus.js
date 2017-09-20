import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  selectMostProminentStatus,
  getContactedStatuses
} from '../utils.js';
import SemesterStatusContent from './SemesterStatusContent';

type Props = {
  semesterStatus: Object,
  editSemester: () => void,
  companyId: number,
  semIndex: number,
  changedStatuses: Array<any>,
  startYear: number,
  startSem: number,
  companySemesters: Array<Object>
};

export default class SemesterStatus extends Component {
  props: Props;

  state = {
    displayDropdown: false
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
          editFunction={statusString =>
            this.props.editSemester(
              companyId,
              semIndex,
              semesterStatus.id,
              getContactedStatuses(semesterStatus.contactedStatus, statusString)
            )}
        />
      </td>
    );
  }
}
