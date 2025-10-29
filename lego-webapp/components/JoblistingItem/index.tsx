import { Flex, Icon, Image, Tooltip } from '@webkom/lego-bricks';
import { CalendarClock, Pin } from 'lucide-react';
import moment from 'moment';
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
  <a
    href={`/joblistings/${joblisting.slug}/`}
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
          <Flex
            justifyContent="space-between"
            alignItems="baseline"
            width="100%"
          >
            <h3>
              {moment(joblisting.createdAt).isAfter(
                moment().subtract(3, 'days'),
              ) && <Tag className={styles.titleTag} tag="Ny" color="green" />}
              {joblisting.title}
            </h3>
            {joblisting.isPinned && (
              <Tooltip className={styles.pin} content={'Festet annonse'}>
                <Icon iconNode={<Pin />} size={18} />
              </Tooltip>
            )}
          </Flex>
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
        <Flex
          gap="var(--spacing-sm)"
          justifyContent="space-between"
          className={styles.joblistingItemBottom}
        >
          <Flex alignItems="center" gap="var(--spacing-xs)">
            <Year joblisting={joblisting} />
            {joblisting.workplaces && (
              <>
                <span>•</span>
                <Workplaces places={joblisting.workplaces} />
              </>
            )}
          </Flex>
          <Flex>
            <div className={styles.joblistingCalender}>
              <Icon iconNode={<CalendarClock />} size={16} />
              {joblisting.rollingRecruitment ? (
                'Snarest'
              ) : (
                <Time
                  time={joblisting.deadline}
                  format={`ll ${moment(joblisting.deadline).format('HH:mm') !== '23:59' ? 'HH:mm' : ''}`}
                />
              )}
            </div>
          </Flex>
        </Flex>
      </Flex>
    </div>
  </a>
);

export default JoblistingItem;
