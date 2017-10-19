// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';
import Image from 'app/components/Image';
import truncateString from 'app/utils/truncateString';

type Props = {
  companies: Array<Object>
};

export function CompanyItem({ company }: any) {
  return (
    <div className={styles.companyItem}>
      <div>
        <Link key={company.id} to={`/companies/${company.id}`}>
          <h3 className={styles.companyItemTitle}>{company.name}</h3>
        </Link>
        <div className={styles.website}>
          {`${company.website} • ${company.address}`
            ? company.website || company.address
            : ''}
        </div>
        <p>{truncateString(company.description, 300)}</p>
      </div>
      <div className={styles.companyLogo}>
        {company.thumbnail && <Image src={company.thumbnail} />}
      </div>
    </div>
  );
}

function CompanyList({ name, companies = [] }) {
  return (
    <div className={styles.companies}>
      <h2 className={styles.heading}>{name}</h2>
      {companies.map((company, i) => <CompanyItem key={i} company={company} />)}
    </div>
  );
}

const CompaniesPage = ({ companies }: Props) => {
  if (companies.length < 1) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <CompanyList name="Bedrifter" companies={companies} />
    </div>
  );
};

export default CompaniesPage;
