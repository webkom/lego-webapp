import React, { Component } from 'react';
import { Link } from 'react-router';
import { indexToSemester } from '../utils.js';
import SemesterStatus from './SemesterStatus';

type Props = {
  company: Object,
  startYear: number,
  startSem: number,
  handleChange: () => void,
  removeChangedStatus: () => void,
  changedStatuses: Array<Object>
};

export default class CompanySingleRow extends Component {

  props: Props;

  semesterElement = (index) => {
    const { startYear, startSem } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    const statuses = this.props.company.semesterStatuses;
    if (statuses) {
      return statuses.find((status) =>
        status.year === result.year &&
        status.semester === result.semester
      ) || { contactedStatus: 6 };
    }
    return { contactedStatus: 6 };
  };

  render() {
    const { company } = this.props;
    if (!company) {
      return 'Laster';
    }
    const semesters = [
      this.semesterElement(0),
      this.semesterElement(1),
      this.semesterElement(2)
    ].map((status, i) => (
      <SemesterStatus
        key={i}
        semIndex={i}
        semesterStatus={status}
        handleChange={this.props.handleChange}
        companyId={this.props.company.id}
        changedStatuses={this.props.changedStatuses}
        startYear={this.props.startYear}
        startSem={this.props.startSem}
      />
    ));

    let comment = company.adminComment;
    let adminComment = '';
    if (comment) {
      if (comment.length > 20) {
        comment = `${comment.substring(0, 17)}...`;
        adminComment = (<Link to={`/bdb/${company.id}`}>{comment}</Link>);
      } else {
        adminComment = comment;
      }
    }

    return (
      <tr>
        <td><Link to={`/bdb/${company.id}`}>{company.name}</Link></td>
        {semesters}
        <td style={{ width: '170px' }}>
          {company.studentContact ? company.studentContact.fullName : ''}
        </td>
        <td>{adminComment}</td>
      </tr>
    );
  }
}
