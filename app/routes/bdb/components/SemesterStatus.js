import React, { Component } from 'react';
import styles from './bdb.css';
import { selectColorCode, statusStrings, indexToSemester } from '../utils.js';

type Props = {
  semesterStatus: Object,
  handleChange: () => void,
  removeChangedStatus: () => void,
  companyId: number,
  semIndex: number,
  changedStatuses: Array<any>,
  startYear: number,
  startSem: number
};

export default class SemesterStatus extends Component {

  props: Props;

  handleChange = (event) => {
    const data = event.target.value.split('-');
    this.props.handleChange(event, parseInt(data[1], 10));
  }

  render() {
    const { semesterStatus, companyId, semIndex, changedStatuses, startYear,
      startSem } = this.props;

    const yearAndSemester = indexToSemester(semIndex, startYear, startSem);
    const matchSemester = (status) => (
      status.year === yearAndSemester.year && status.semester === yearAndSemester.semester
      && status.companyId === companyId
    );

    return (
      <td className={styles[selectColorCode(semesterStatus.contactedStatus)]}>

        <select onChange={this.handleChange} value={
          `${companyId}-${semIndex}-${semesterStatus.id}-${semesterStatus.contactedStatus}`
        }
        >
          {Object.keys(statusStrings).map((statusString, j) => (
            <option key={j} value={`${companyId}-${semIndex}-${semesterStatus.id}-${j}`}>
              {statusStrings[j]}
              {changedStatuses.find(matchSemester) &&
                parseInt(semesterStatus.contactedStatus, 10) === j ? ' *' : ''}
            </option>
          ))}
        </select>
      </td>
    );
  }
}
