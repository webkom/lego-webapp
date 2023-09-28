import { Button, Icon } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'app/store/hooks';
import type { AnnouncementCreateLocationState } from 'app/routes/announcements/components/AnnouncementsCreate';
import type { DetailedEvent } from 'app/store/models/Event';
import type { DetailedGroup } from 'app/store/models/Group';
import type { DetailedMeeting } from 'app/store/models/Meeting';

type Props = {
  event?: DetailedEvent;
  meeting?: DetailedMeeting;
  group?: DetailedGroup;
};

const TypedLink = Link<AnnouncementCreateLocationState>;

const AnnouncementInLine = ({ event, meeting, group }: Props) => {
  const actionGrant = useAppSelector((state) => state.allowed.announcements);
  return (
    actionGrant && (
      <TypedLink
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
      </TypedLink>
    )
  );
};

export default AnnouncementInLine;
