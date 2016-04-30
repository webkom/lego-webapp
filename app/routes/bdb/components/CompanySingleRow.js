import React, { Component, PropTypes } from 'react';
import styles from './bdbPage.css';
import { Link } from 'react-router';
import { selectColorCode, statusIntToString, indexToSemester } from '../utils.js';
export default class CompanySingleRow extends Component {

  static propTypes = {
    company: PropTypes.object.isRequired,
    startYear: PropTypes.number.isRequired,
    startSem: PropTypes.number.isRequired
  };

  semesterElement = (index) => {
    const { startYear, startSem } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    const statuses = this.props.company.semesterStatuses;

    return statuses.find((status) =>
      status.year === result.year &&
      status.semester === result.semester
    ) || { contactedStatus: 6 };
  };

  render() {
    const { company } = this.props;
    let semesters = [];
    if (company) {
      semesters = [
        this.semesterElement(0),
        this.semesterElement(1),
        this.semesterElement(2),
        this.semesterElement(3)
      ].map((status, i) => (
        <td key={i} className={styles[selectColorCode(status.contactedStatus)]}>
          {statusIntToString(status.contactedStatus)}
        </td>
      ));
    }


    return (
      <tr>
        <td>
          <Link to={`/bdb/${company.id}`}>{company.name}</Link></td>
        {semesters}
        <td>{company.studentContact}</td>
        <td>{company.adminComment}</td>
      </tr>
    );
  }
}
