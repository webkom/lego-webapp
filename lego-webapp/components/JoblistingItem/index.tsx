import { BaseCard, Flex, Icon, Image } from '@webkom/lego-bricks';
import { CalendarClock, GraduationCap, MapPin, Pin } from 'lucide-react';
import moment from 'moment';
import {
  jobType,
  jobTypeColor,
  Workplaces,
  Year,
} from '~/components/JoblistingItem/Items';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import styles from './JoblistingItem.module.css';
import type { ListJoblisting } from '~/redux/models/Joblisting';

const JoblistingItem = ({ joblisting }: { joblisting: ListJoblisting }) => (
  <a
    href={`/joblistings/${joblisting.slug}/`}
    className={styles.joblistingItem}
  >
    <BaseCard hoverable shadow className={styles.card}>
      <Flex column gap="var(--spacing-xs)" className={styles.main}>
        <Flex
          gap="var(--spacing-xs)"
          alignItems="center"
          className={styles.secondary}
        >
          {joblisting.isPinned && <Icon iconNode={<Pin />} size={14} />}
          {joblisting.company.name}
          {moment(joblisting.createdAt).isAfter(
            moment().subtract(3, 'days'),
          ) && <Tag tag="Ny" color="green" />}
        </Flex>
        <h3 className={styles.title}>{joblisting.title}</h3>
        <Flex
          wrap
          alignItems="center"
          gap="var(--spacing-xs) var(--spacing-md)"
        >
          {joblisting.jobType && (
            <Tag
              tag={jobType(joblisting.jobType)}
              color={jobTypeColor(joblisting.jobType)}
            />
          )}
          <span className={styles.metaItem}>
            <Icon iconNode={<GraduationCap />} size={16} />
            <Year joblisting={joblisting} />
          </span>
          <span className={styles.metaItem}>
            <Icon iconNode={<MapPin />} size={16} />
            <Workplaces places={joblisting.workplaces} />
          </span>
          <span className={styles.metaItem}>
            <Icon iconNode={<CalendarClock />} size={16} />
            {joblisting.rollingRecruitment ? (
              'Snarest'
            ) : (
              <Time
                time={joblisting.deadline}
                format={`ll ${moment(joblisting.deadline).format('HH:mm') !== '23:59' ? 'HH:mm' : ''}`}
              />
            )}
          </span>
        </Flex>
      </Flex>
      {joblisting.company.logo && (
        <Image
          className={styles.logo}
          src={joblisting.company.logo}
          placeholder={joblisting.company.logoPlaceholder}
          alt={`${joblisting.company.name} sin logo`}
        />
      )}
    </BaseCard>
  </a>
);

export default JoblistingItem;
