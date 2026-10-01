import { Icon, Tooltip } from '@webkom/lego-bricks';
import { Share2 } from 'lucide-react';
import { addToast } from '~/components/Toast/ToastProvider';
import { appConfig } from '~/utils/appConfig';
import styles from './EventDetail.module.css';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from '~/redux/models/Event';

export type ShareButtonProps = {
  event: AuthUserDetailedEvent | UserDetailedEvent;
};

export const ShareButton = ({ event }: ShareButtonProps) => {
  const shareUrl = `${appConfig?.webUrl}/events/${event.slug || event.id}`;

  const onPress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, url: shareUrl });
      } catch {
        // User cancelled the native share sheet - do nothing
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      addToast({
        message: 'Lenke kopiert til utklippstavlen',
        type: 'success',
      });
    } catch {
      addToast({ message: 'Kunne ikke kopiere lenken', type: 'error' });
    }
  };

  return (
    <Tooltip content="Del arrangementet">
      <Icon
        iconNode={<Share2 />}
        onPress={onPress}
        className={styles.shareButton}
      />
    </Tooltip>
  );
};
