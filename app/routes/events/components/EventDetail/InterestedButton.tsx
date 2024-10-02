import { Icon } from '@webkom/lego-bricks';
import { Star } from 'lucide-react';
import { follow, unfollow } from 'app/actions/EventActions';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser } from 'app/reducers/auth';
import styles from 'app/routes/events/components/EventDetail/EventDetail.css';
import { useAppDispatch } from 'app/store/hooks';
import type { UserDetailedEvent } from 'app/store/models/Event';

export type InterestedButtonProps = {
  event: UserDetailedEvent;
};

export const InterestedButton = ({ event }: InterestedButtonProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const following = event.following;

  const onClick = following
    ? () => dispatch(unfollow(following, event.id))
    : () => dispatch(follow(currentUser.id, event.id));

  return (
    <Tooltip content="Følg arrangementet, og få e-post når påmelding nærmer seg!">
      <Icon
        iconNode={
          <Star fill={following ? 'var(--color-orange-6)' : 'transparent'} />
        }
        onClick={onClick}
        className={styles.star}
      />
    </Tooltip>
  );
};
