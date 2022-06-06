// @flow

import { Link } from 'react-router-dom';
import styles from './JoblistingList.css';
import { Image } from 'app/components/Image';
import Time from 'app/components/Time';
import { Flex } from 'app/components/Layout';
import { Year, jobType, Workplaces } from './Items';
import Tag from 'app/components/Tags/Tag';
import moment from 'moment-timezone';

type JobListingItemProps = {
  joblisting: /*TODO: JobListing*/ Object,
};

const JoblistingItem = ({ joblisting }: JobListingItemProps) => (
  <Link to={`/joblistings/${joblisting.id}/`} className={styles.joblistingItem}>
    {joblisting.company.logo && (
      <Image
        className={styles.companyLogo}
        src={joblisting.company.logo}
        placeholder={joblisting.company.logoPlaceholder}
      />
    )}
    <div className={styles.listItem}>
      <div>
        <Flex wrap gap={4}>
          {moment(joblisting.createdAt).isAfter(
            moment().subtract(3, 'days')
          ) && <Tag tag="NY" color="green" />}
          <h3 className={styles.joblistingItemTitle}>{joblisting.title}</h3>
        </Flex>
        <div>
          {joblisting.company.name}
          {joblisting.jobType && (
            <>
              <span> • </span>
              {jobType(joblisting.jobType)}
            </>
          )}
        </div>
        <div>
          <Year joblisting={joblisting} />
          {joblisting.workplaces && (
            <>
              <span> • </span>
              <Workplaces places={joblisting.workplaces} />
            </>
          )}
        </div>
      </div>
      <Time
        time={joblisting.deadline}
        style={{ width: '135px' }}
        format="ll HH:mm"
        className={styles.deadLine}
      />
    </div>
  </Link>
);

type JobListingsListProps = {
  joblistings: /*TODO: JobListings*/ Array<Object>,
};

const JoblistingsList = ({ joblistings }: JobListingsListProps) => (
  <Flex column className={styles.joblistingList}>
    <Flex className={styles.heading}>
      <h2 className={styles.headingText}>Jobbannonser</h2>
      <h4 className={styles.headingDeadline}>Søknadsfrist:</h4>
    </Flex>
    {joblistings.map((joblisting) => (
      <JoblistingItem key={joblisting.id} joblisting={joblisting} />
    ))}
  </Flex>
);

export default JoblistingsList;
