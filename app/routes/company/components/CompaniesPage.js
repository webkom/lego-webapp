// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';

type Props = {
  companies: Array<Object>
};

const CompaniesPage = ({ companies }: Props) => {
  if (companies.length < 1) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <h1>Companies</h1>
      <p>
        {companies.map((company, id) => (
          <Link key={id} to={`/companies/${company.id}`}>
            {company.name}{' '}
          </Link>
        ))}
      </p>
    </div>
  );
};

export default CompaniesPage;
