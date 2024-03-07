import { Flex } from '@webkom/lego-bricks';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { jobType, Year, Workplaces } from 'app/components/JoblistingItem/Items';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import styles from './JoblistingItem.css';
import type { ListJoblisting } from 'app/store/models/Joblisting';

type JobListingItemProps = {
  joblisting: ListJoblisting;
};

const JoblistingItem = ({ joblisting }: JobListingItemProps) => (
  <Link
    to={`/joblistings/${joblisting.slug}/`}
    className={styles.joblistingItem}
  >
    {joblisting.company.logo && (
      <Image
        className={styles.companyLogo}
        src={joblisting.company.logo}
        placeholder={joblisting.company.logoPlaceholder}
        alt={`${joblisting.company.name} logo`}
      />
    )}
    <div className={styles.listItem}>
      <div>
        <Flex
          wrap
          alignItems="center"
          gap="var(--spacing-sm)"
          className={styles.joblistingItemTitle}
        >
          {moment(joblisting.createdAt).isAfter(
            moment().subtract(3, 'days')
          ) && <Tag tag="Ny" color="green" />}
          <span>{joblisting.title}</span>
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
        format="ll HH:mm"
        className={styles.deadLine}
      />
    </div>
  </Link>
);

export default JoblistingItem;
