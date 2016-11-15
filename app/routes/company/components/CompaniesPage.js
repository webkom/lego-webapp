import React, { Component } from 'react';
import styles from './company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';

type Props = {
  company: Array<Object>,
  query: Object
};

export default class CompaniesPage extends Component {
  props: Props;


  render() {
    const { companies } = this.props;
    if (companies.length < 1) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <h1>Companies</h1>
        <p>{companies.map(
          (company, id) => (<Link key={id} to={`/companies/${company.id}`}>{company.name} </Link>)
        )}</p>
      </div>
    );
  }
}
