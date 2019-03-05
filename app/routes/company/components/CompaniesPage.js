// @flow

import React from 'react';
import styles from './CompaniesPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router';
import { Image } from 'app/components/Image';
import type { Company } from 'app/models';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';

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
            <h3>{company.name}</h3>
          </div>
        </Link>
        <Flex className={styles.companyInfo}>
          <Flex column>
            <Icon name="briefcase" size={20} />
            <span>{company.joblistingCount}</span>
          </Flex>
          <Flex column>
            <Icon name="calendar" size={20} />
            <span>{company.eventCount}</span>
          </Flex>
          <a href={company.website} target="_blank">
            <Flex column>
              <Icon name="at" size={20} style={{ color: '#777' }} />
              <span />
            </Flex>
          </a>
        </Flex>
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
