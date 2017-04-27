import React from 'react';
import { Link } from 'react-router';
import styles from './JoblistingsList.css';
import Image from 'app/components/Image';
import Time from 'app/components/Time';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import { Year, Jobtype, Workplaces } from './Items';

type Props = {
  joblisting: Object,
  joblistings: Array
};

function JoblistingItem({ joblisting }: Props) {
  return (
    <FlexRow className={styles.joblistingItem}>
      <FlexRow>
        <FlexColumn>
          <Link to={`/joblistings/${joblisting.id}/`}>
            <Image
              src="http://placehold.it/120x80"
              className={styles.companyLogo}
            />
          </Link>
        </FlexColumn>
        <FlexColumn>
          <Link to={`/joblistings/${joblisting.id}/`}>
            <h3 className={styles.joblistingItemTitle}>{joblisting.title}</h3>
          </Link>
          <div className={styles.companyJobtype}>
            {joblisting.company.name} • {Jobtype(joblisting.jobType)}
          </div>
          <Year {...joblisting} />
          <Workplaces places={joblisting.workplaces} />
        </FlexColumn>
      </FlexRow>
      <FlexColumn className={styles.deadLine}>
        <div>
          <Time time={joblisting.deadline} format="ll HH:mm" />
        </div>
      </FlexColumn>
    </FlexRow>
  );
}

function JoblistingListGroup({ joblistings = [] }: Props) {
  return (
    <div>
      <FlexRow className={styles.heading}>
        <FlexColumn>
          <h2 className={styles.headingText}>Jobbannonser</h2>
        </FlexColumn>
        <FlexColumn className={styles.headingDeadline}>
          Deadline:
        </FlexColumn>
      </FlexRow>
      {joblistings.map((joblisting, i) => (
        <JoblistingItem key={i} joblisting={joblisting} />
      ))}
    </div>
  );
}

const JoblistingsList = ({ joblistings }: Props) => (
  <JoblistingListGroup joblistings={joblistings} />
);

export default JoblistingsList;
