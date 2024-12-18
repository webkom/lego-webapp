import { Button } from '@webkom/lego-bricks';
import { Pizza } from 'lucide-react';
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

export const PizzaButton = ({ meeting, meetingInvitations }: Props) => {
  const pizzaUsers: string[] =
    meeting.reactions
      ?.filter((reaction) => reaction.emoji === ':pizza:')
      .map((reaction) => reaction.author.fullName)
      .sort() ?? [];

  const attendence: string[] = meetingInvitations
    .filter((invite) => invite.status === MeetingInvitationStatus.Attending)
    .map((invite) => invite.user.fullName);

  const notPizzaUsers = attendence
    .filter((name) => !pizzaUsers.includes(name))
    .sort();

  const pizzaHasBeenReacted = pizzaUsers && notPizzaUsers;
  const tooltipContent = pizzaHasBeenReacted ? (
    <div>
      <h3>Skal ha pizza</h3>
      {pizzaUsers.map((user) => (
        <div key={user}>{user}</div>
      ))}
      <h3>Skal ikke ha pizza</h3>
      {notPizzaUsers.map((user: string) => (
        <div key={user}>{user}</div>
      ))}
    </div>
  ) : undefined;

  return (
    <Tooltip content={tooltipContent}>
      <Button>
        <Pizza /> Pizza-reaksjoner
      </Button>
    </Tooltip>
  );
};
