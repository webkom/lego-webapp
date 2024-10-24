import { Button } from '@webkom/lego-bricks';
import { ContentList } from 'app/components/ContententList';
import Tooltip from 'app/components/Tooltip';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { EntityId } from '@reduxjs/toolkit';
import type { MeetingInvitationWithUser } from 'app/reducers/meetingInvitations';
import type { ReactionsGrouped } from 'app/store/models/Reaction';

type Props = {
  meeting: {
    reactionsGrouped?: ReactionsGrouped[];
    invitations: EntityId[];
    reactions?: { author: { fullName: string }; emoji: string }[];
  };
  meetingInvitations: MeetingInvitationWithUser[];
};

export const PizzaMettingbutton = ({ meeting, meetingInvitations }: Props) => {
  const pizza_users: string[] =
    meeting.reactions
      ?.filter((reaction) => reaction.emoji === ':pizza:')
      .map((reaction) => reaction.author.fullName)
      .sort() ?? [];

  const attendence: string[] = meetingInvitations
    .filter((invite) => invite.status === MeetingInvitationStatus.Attending)
    .map((invite) => invite.user)
    .map((user) => user.fullName);

  const notPizzaUsers = attendence
    .filter((name) => !pizza_users.includes(name))
    .sort();

  const tooltipContent =
    'Skal ha pizza:  \n' +
    pizza_users.join('\n') +
    '\n ------\n' +
    'Skal IKKE ha pizza:\n' +
    notPizzaUsers.join('\n');

  return (
    <Tooltip content={<ContentList content={tooltipContent} />}>
      <Button>Pizza reaction difference</Button>
    </Tooltip>
  );
};
