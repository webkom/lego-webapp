// @flow
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from 'app/components/Button';
import type { Event, Group } from 'app/models';

import styles from './AnnouncementInLine.css';

type Props = {
  event?: Event,
  meeting?: Object,
  group?: Group,
};

const AnnouncementInLine = ({ event, meeting, group }: Props) => {
  const actionGrant = useSelector((state) => state.allowed.announcements);

  return (
    actionGrant && (
      <Link
        to={{
          pathname: '/announcements',
          state: { event, meeting, group },
        }}
      >
        <Button className={styles.announcementButton}>Ny kunngjøring</Button>
      </Link>
    )
  );
};

export default AnnouncementInLine;
