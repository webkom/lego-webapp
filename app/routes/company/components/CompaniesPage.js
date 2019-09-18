// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router';
import { Image } from 'app/components/Image';
import type { Company } from 'app/models';

type Props = {
  companies: Array<Company>,
  fetchMore: () => void,
  showFetchMore: () => void,
  hasMore: boolean,
  fetching: boolean
};

const CompanyItem = ({ company }: Company) => {
  const [protocol, , domain] = company.website
    ? company.website.split('/')
    : ['', '', ''];
  const websiteString = `${protocol}//${domain}`;

  return (
    <div className={styles.companyItem}>
      <div className={styles.companyItemContent}>
        <Link to={`/companies/${company.id}`}>
          <div className={styles.companyLogo}>
            {<Image src={company.logo} />}
          </div>
          <div className={styles.companyItemTitle}>
            <h2>{company.name}</h2>
          </div>
          <div className={styles.companyInfo}>
            <span>
              {company.joblistingCount > 0 &&
                company.joblistingCount + ' jobbannonser'}
            </span>
            <span>
              {company.eventCount > 0 && company.eventCount + ' arrangementer'}
            </span>
          </div>
        </Link>
        {company.website && !company.website.includes('example.com') && (
          <a href={company.website} rel="noopener noreferrer" target="_blank">
            <div className={styles.website}>{websiteString}</div>
          </a>
        )}
      </div>
    </div>
  );
};

type CompanyListProps = {
  companies: Array<Company>
};

const CompanyList = ({ companies = [] }: CompanyListProps) => (
  <div className={styles.companyList}>
    {companies.map((company, id) => (
      <CompanyItem key={id} company={company} />
    ))}
  </div>
);

const CompaniesPage = (props: Props) => (
  <div className={styles.root}>
    <h2 className={styles.heading}>Bedrifter</h2>
    <InfiniteScroll
      element="div"
      hasMore={props.hasMore}
      loadMore={() => props.hasMore && !props.fetching && props.fetchMore()}
      initialLoad={false}
      loader={<LoadingIndicator loading />}
    >
      <CompanyList companies={props.companies} />
    </InfiniteScroll>
  </div>
);

export default CompaniesPage;
