import { Button } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { useAppSelector } from 'app/store/hooks';
import type { UnknownEvent } from 'app/store/models/Event';
import type { UnknownGroup } from 'app/store/models/Group';
import type { UnknownMeeting } from 'app/store/models/Meeting';

type Props = {
  event?: UnknownEvent;
  meeting?: UnknownMeeting;
  group?: UnknownGroup;
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
