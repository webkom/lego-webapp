import React, { Component } from 'react';
import styles from './company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  company: Array<Object>,
  query: Object
};

export default class CompaniesPage extends Component {
  props: Props;


  render() {
    const { companies } = this.props;
    if (companies.length < 1) {
      return <LoadingIndicator loading/>;
    }

    return (
      <div className={styles.root}>
        <h1>Companies</h1>
        <p>{companies.map(
          (company, id) => (<a key={id} href={`companies/${company.id}`}>{company.name} </a>)
        )}</p>
      </div>
    );
  }
}
