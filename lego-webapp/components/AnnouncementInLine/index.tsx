import { Icon, LinkButton } from '@webkom/lego-bricks';
import { Send } from 'lucide-react';
import { useAppSelector } from '~/redux/hooks';
import type { AnnouncementCreateLocationState } from '~/pages/announcements/AnnouncementsCreate';
import type { CompleteEvent } from '~/redux/models/Event';
import type { UnknownGroup } from '~/redux/models/Group';
import type { UnknownMeeting } from '~/redux/models/Meeting';

type Props = {
  event?: Pick<CompleteEvent, 'id' | 'title'>;
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
      <Icon iconNode={<Send />} size={18} />
      Send kunngjøring
    </LinkButton>
  );
};

export default AnnouncementInLine;
