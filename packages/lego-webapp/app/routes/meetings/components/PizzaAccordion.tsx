import { Accordion, Icon } from '@webkom/lego-bricks';
import { ChevronRight, Pizza } from 'lucide-react';
import { FlexRow } from 'app/components/FlexBox';
import { MeetingInvitationStatus } from '~/redux/models/MeetingInvitation';
import styles from './MeetingDetail.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { MeetingInvitationWithUser } from '~/redux/slices/meetingInvitations';

type Props = {
  meeting: {
    reactionsGrouped?: ReactionsGrouped[];
    invitations: EntityId[];
    reactions?: { author: { fullName: string }; emoji: string }[];
  };
  meetingInvitations: MeetingInvitationWithUser[];
};

export const PizzaAccordion = ({ meeting, meetingInvitations }: Props) => {
  const pizzaUsers: string[] =
    meeting.reactions
      ?.filter((reaction) => reaction.emoji === ':pizza:')
      .map((reaction) => reaction.author.fullName)
      .sort() ?? [];

  const attendingUsers: string[] = meetingInvitations
    .filter((invite) => invite.status === MeetingInvitationStatus.Attending)
    .map((invite) => invite.user.fullName);

  const notPizzaUsers = attendingUsers
    .filter((name) => !pizzaUsers.includes(name))
    .sort();

  return (
    <div className={styles.pizzaTrigger}>
      <Accordion
        triggerComponent={({ onClick, rotateClassName }) => (
          <div onClick={onClick}>
            <FlexRow alignItems="center">
              <Icon iconNode={<Pizza />} /> Pizza
            </FlexRow>
            <Icon
              onPress={() => {
                onClick();
              }}
              iconNode={<ChevronRight />}
              className={rotateClassName}
            />
          </div>
        )}
      >
        {
          <div>
            <h3>Skal ha pizza</h3>
            <ul className={styles.pizzaList}>
              {pizzaUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
            <h3>Skal ikke ha pizza</h3>
            <ul className={styles.pizzaList}>
              {notPizzaUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>
        }
      </Accordion>
    </div>
  );
};
