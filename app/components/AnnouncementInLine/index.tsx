import { Icon, LinkButton } from '@webkom/lego-bricks';
import { useAppSelector } from 'app/store/hooks';
import type { AnnouncementCreateLocationState } from 'app/routes/announcements/components/AnnouncementsCreate';
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

  if (!actionGrant) {
    return null;
  }

  return (
    <LinkButton
      href="/announcements"
      state={
        {
          event,
          meeting,
          group,
        } as AnnouncementCreateLocationState
      }
    >
      <Icon name="send-outline" size={18} />
      Send kunngjøring
    </LinkButton>
  );
};

export default AnnouncementInLine;
