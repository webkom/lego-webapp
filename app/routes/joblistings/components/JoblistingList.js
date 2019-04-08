// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './JoblistingList.css';
import { Image } from 'app/components/Image';
import Time from 'app/components/Time';
import { Flex } from 'app/components/Layout';
import { Year, jobType, Workplaces } from './Items';

type JobListingItemProps = {
  joblisting: /*TODO: JobListing*/ Object
};

function JoblistingItem({ joblisting }: JobListingItemProps) {
  return (
    <Flex className={styles.joblistingItem}>
      <Flex alignItems="center">
        <Link to={`/joblistings/${joblisting.id}/`}>
          <div className={styles.companyLogoContainer}>
            {joblisting.company.logo && (
              <Image
                className={styles.companyLogo}
                src={joblisting.company.logo}
              />
            )}
          </div>
        </Link>
      </Flex>
      <Flex className={styles.listItem}>
        <div>
          <Link to={`/joblistings/${joblisting.id}/`}>
            <Flex>
              <h3 className={styles.joblistingItemTitle}>{joblisting.title}</h3>
            </Flex>
          </Link>
          <div className={styles.companyJobtype}>
            {joblisting.company.name} • {jobType(joblisting.jobType)}
          </div>
          <Year joblisting={joblisting} /> •
          <Workplaces places={joblisting.workplaces} />
        </div>
        <div className={styles.deadLine}>
          <span className={styles.deadLineLabel} style={{ marginRight: '5px' }}>
            {'Frist  • '}
          </span>
          <span>
            <Time
              time={joblisting.deadline}
              style={{ width: '135px' }}
              format="ll HH:mm"
            />
          </span>
        </div>
      </Flex>
    </Flex>
  );
}

type JobListingsItemProps = {
  joblistings: /*TODO: JobListings*/ Array<Object>
};

const JoblistingsList = ({ joblistings }: JobListingsItemProps) => (
  <Flex column className={styles.joblistingList}>
    <Flex className={styles.heading}>
      <h2 className={styles.headingText}>Jobbannonser</h2>
      <h4 className={styles.headingDeadline}>Søknadsfrist:</h4>
    </Flex>
    {joblistings.map(joblisting => (
      <JoblistingItem key={joblisting.id} joblisting={joblisting} />
    ))}
  </Flex>
);

export default JoblistingsList;
