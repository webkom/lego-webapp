import React, { Component } from 'react';
import styles from './company.css';

type Props = {
  company: Array<Object>
};

export default class CompanyDetail extends Component {
  props: Props;


  render() {
    const { company } = this.props;
    if (!company) {
      return (
        <div>
        'Laster...'
        </div>
      );
    }
    return (
      <div className={styles.root}>
        <h1>{company.name}</h1>
        <p>IDnr: {company.id}</p>
        <p>Description: {company.description}</p>
        <p>Phone: {company.phone}</p>
        <p>Semesterstatus IDnr: {company.semesterStatuses[0].id}</p>
        <p>Website: {company.website}</p>
      </div>
    );
  }
}
