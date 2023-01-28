import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { useAppSelector } from 'app/store/hooks';
import type { AnyEvent } from 'app/store/models/Event';
import type { AnyGroup } from 'app/store/models/Group';
import type { AnyMeeting } from 'app/store/models/Meeting';

type Props = {
  event?: AnyEvent;
  meeting?: AnyMeeting;
  group?: AnyGroup;
};

const AnnouncementInLine = ({ event, meeting, group }: Props) => {
  const actionGrant = useAppSelector((state) => state.allowed.announcements);
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
