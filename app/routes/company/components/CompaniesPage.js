// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';
import { Image } from 'app/components/Image';
import type { Company } from 'app/models';
import { Button } from 'app/components/Form';

type Props = {
  companies: Array<Company>,
  showFetchMore: () => void,
  fetchMore: () => void
};

export function CompanyItem({ company }: any) {
  return (
    <div className={styles.companyItem}>
      <div>
        <Link to={`/companies/${company.id}`}>
          <h3 className={styles.companyItemTitle}>{company.name}</h3>
        </Link>
        <a href={company.website}>
          <div className={styles.website}>{company.website}</div>
        </a>
        <div>{company.companyType}</div>
        <div>{company.address}</div>
      </div>
      <Link to={`/companies/${company.id}`}>
        {company.thumbnail && (
          <Image src={company.thumbnail} className={styles.companyLogo} />
        )}
      </Link>
    </div>
  );
}

type CompanyListProps = {
  name: string,
  companies: Array<Company>
};

function CompanyList({ name, companies = [] }: CompanyListProps) {
  return (
    <div className={styles.companies}>
      <h2 className={styles.heading}>{name}</h2>
      {companies.map((company, i) => <CompanyItem key={i} company={company} />)}
    </div>
  );
}

const CompaniesPage = (props: Props) => {
  if (props.companies.length < 1) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <CompanyList name={'Bedrifter'} companies={props.companies} />
      {props.showFetchMore && (
        <Button onClick={() => props.fetchMore()}>Flere bedrifter</Button>
      )}
    </div>
  );
};

export default CompaniesPage;
