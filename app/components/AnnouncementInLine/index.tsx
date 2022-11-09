import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import type { Group, Event } from 'app/models';

type Props = {
  event?: Event;
  meeting?: Record<string, any>;
  group?: Group;
};

const AnnouncementInLine = ({ event, meeting, group }: Props) => {
  const actionGrant = useSelector((state) => state.allowed.announcements);
  return (
    actionGrant && (
      <Link
        to={{
          pathname: '/announcements',
          state: {
            event,
            meeting,
            group,
          },
        }}
      >
        <Button>
          <Icon name="send-outline" size={18} />
          Send kunngjøring
        </Button>
      </Link>
    )
  );
};

export default AnnouncementInLine;
