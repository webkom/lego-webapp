import { Flex, Icon, Image } from '@webkom/lego-bricks';
import { CalendarClock } from 'lucide-react';
import moment from 'moment';
import { Link } from 'react-router';
import {
  jobType,
  Year,
  Workplaces,
  jobTypeColor,
} from '~/components/JoblistingItem/Items';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import styles from './JoblistingItem.module.css';
import type { ListJoblisting } from '~/redux/models/Joblisting';

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
        alt={`${joblisting.company.name} sin logo`}
      />
    )}
    <div className={styles.listItem}>
      <Flex column gap="var(--spacing-xs)">
        <Flex
          wrap
          alignItems="center"
          gap="var(--spacing-xs)"
          className={styles.joblistingItemTitle}
        >
          {moment(joblisting.createdAt).isAfter(
            moment().subtract(3, 'days'),
          ) && <Tag tag="Ny" color="green" />}
          <span>{joblisting.title}</span>
        </Flex>
        <Flex alignItems="center" gap="var(--spacing-xs)">
          {joblisting.company.name}
          {joblisting.jobType && (
            <>
              <span>•</span>
              <Tag
                tag={jobType(joblisting.jobType)}
                color={jobTypeColor(joblisting.jobType)}
              />
            </>
          )}
        </Flex>
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <Year joblisting={joblisting} />
          {joblisting.workplaces && (
            <>
              <span>•</span>
              <Workplaces places={joblisting.workplaces} />
            </>
          )}
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        gap="var(--spacing-sm)"
        className={styles.deadline}
      >
        <Icon iconNode={<CalendarClock />} size={16} />
        {joblisting.rollingRecruitment ? (
          'Snarest'
        ) : (
          <Time
            time={joblisting.deadline}
            format={`ll ${moment(joblisting.deadline).format('HH:mm') !== '23:59' ? 'HH:mm' : ''}`}
          />
        )}
      </Flex>
    </div>
  </Link>
);

export default JoblistingItem;
