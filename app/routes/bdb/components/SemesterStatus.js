import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  statusStrings,
  getStatusString,
  indexToSemester
} from '../utils.js';

type Props = {
  semesterStatus: Object,
  editSemester: () => void,
  companyId: number,
  semIndex: number,
  changedStatuses: Array<any>,
  startYear: number,
  startSem: number
};

export default class SemesterStatus extends Component {
  props: Props;

  editSemester = event => {
    const data = event.target.value.split('-');
    this.props.editSemester(event, Number(data[1]));
  };

  render() {
    const {
      semesterStatus,
      companyId,
      semIndex,
      changedStatuses,
      startYear,
      startSem
    } = this.props;

    const yearAndSemester = indexToSemester(semIndex, startYear, startSem);
    const matchSemester = status =>
      status.year === yearAndSemester.year &&
      status.semester === yearAndSemester.semester &&
      status.companyId === companyId;

    return (
      <td
        className={styles[selectColorCode(semesterStatus.contactedStatus[0])]}
      >
        <select
          onChange={this.editSemester}
          value={`${companyId}-${semIndex}-${semesterStatus.id}-${semesterStatus
            .contactedStatus[0]}`}
        >
          {Object.keys(statusStrings).map((statusString, j) =>
            <option
              key={j}
              value={`${companyId}-${semIndex}-${semesterStatus.id}-${statusString}`}
            >
              {getStatusString(statusString)}
              {changedStatuses.find(matchSemester) &&
              Number(semesterStatus.contactedStatus[0]) === j
                ? ' *'
                : ''}
            </option>
          )}
        </select>
      </td>
    );
  }
}
