import React, { Component } from 'react';
import styles from './company.css';

type Props = {
  company: Array<Object>,
  query: Object
};

export default class CompaniesPage extends Component {
  props: Props;


  render() {
    const { companies } = this.props;
    if (companies.length < 1) {
      return (
        <div>
        'Laster...'
        </div>
      );
    }

    return (
      <div className={styles.root}>
        <h1>Companies</h1>
        <p>{companies.map(
          (company) => (<a href={`./${company.id}`}>{company.name} </a>)
        )}</p>
      </div>
    );
  }
}
