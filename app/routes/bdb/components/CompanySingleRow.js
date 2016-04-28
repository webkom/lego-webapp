import React, { Component, PropTypes } from 'react';
import styles from './bdbPage.css';

export default class CompanySingleRow extends Component {

  selectColorCode(status) {
    const statusToClass = {
      'bedpres': 'bedpres',
      'bedpres & kurs': 'bedpresKurs',
      'kurs': 'kurs',
      'interessert, ikke tilbudt': 'notOffered',
      'ikke interessert': 'notInterested',
      'kontaktet': 'contacted',
      'ikke kontaktet': 'notContacted'
    };
    return statusToClass[status.toLowerCase()] || 'notContacted';
  }

  static propTypes = {
    company: PropTypes.object.isRequired
  };

  render() {
    const { company } = this.props;
    const semesters = company.contacted.map((contacted, i) => (
      <td key={i} className={styles[this.selectColorCode(contacted)]}>
        {contacted}
      </td>
    ));
    return (
      <tr>
        <td>{company.name}</td>
        {semesters}
        <td>{company.studentContact}</td>
        <td>{company.comment}</td>
      </tr>
    );
  }
}
