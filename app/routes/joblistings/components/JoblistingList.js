// @flow

import React from 'react';
import { Link } from 'react-router';
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
    <Flex row className={styles.joblistingItem}>
      <Flex alignItems="center">
        <Link to={`/joblistings/${joblisting.id}/`}>
          <Image
            src="http://placehold.it/120x80"
            className={styles.companyLogo}
          />
        </Link>
      </Flex>
      <Flex row justifyContent="space-between" style={{ flex: 1 }}>
        <div>
          <Link to={`/joblistings/${joblisting.id}/`}>
            <h3 className={styles.joblistingItemTitle}>{joblisting.title}</h3>
          </Link>
          <div className={styles.companyJobtype}>
            {joblisting.company.name} • {jobType(joblisting.jobType)}
          </div>
          <Year joblisting={joblisting} />
          <Workplaces places={joblisting.workplaces} />
        </div>
        <div className={styles.deadLine}>
          <Time time={joblisting.deadline} format="ll HH:mm" />
        </div>
      </Flex>
    </Flex>
  );
}

const JoblistingsList = ({ joblistings }: Props) => (
  <Flex column style={{ flex: 3 }}>
    <Flex row className={styles.heading}>
      <h2 className={styles.headingText}>Jobbannonser</h2>
      <h4 className={styles.headingDeadline}>Deadline:</h4>
    </Flex>
    {joblistings.map((joblisting, i) => (
      <JoblistingItem key={i} joblisting={joblisting} />
    ))}
  </Flex>
);

export default JoblistingsList;
