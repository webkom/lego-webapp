import { Icon } from '@webkom/lego-bricks';
import { Star } from 'lucide-react';
import Tooltip from 'app/components/Tooltip';
import styles from 'app/routes/events/components/EventDetail/EventDetail.module.css';
import { follow, unfollow } from '~/redux/actions/EventActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import type { UserDetailedEvent } from '~/redux/models/Event';

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

  const onPress = following
    ? () => dispatch(unfollow(following, event.id))
    : () => dispatch(follow(currentUser.id, event.id));

  return (
    <Tooltip content="Følg arrangementet, og få e-post når påmelding nærmer seg!">
      <Icon
        iconNode={
          <Star fill={following ? 'var(--color-orange-6)' : 'transparent'} />
        }
        onPress={onPress}
        className={styles.star}
      />
    </Tooltip>
  );
};
