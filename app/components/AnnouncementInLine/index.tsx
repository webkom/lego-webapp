import { Icon, LinkButton } from '@webkom/lego-bricks';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const actionGrant = useAppSelector((state) => state.allowed.announcements);

  if (!actionGrant) {
    return null;
  }

  return (
    <LinkButton
      onPress={() => {
        navigate('/announcements', {
          state: {
            event,
            meeting,
            group,
          } as AnnouncementCreateLocationState,
        });
      }}
    >
      <Icon name="send-outline" size={18} />
      Send kunngjøring
    </LinkButton>
  );
};

export default AnnouncementInLine;
