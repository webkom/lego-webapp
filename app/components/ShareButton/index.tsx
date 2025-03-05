import { Button, Icon } from '@webkom/lego-bricks';
import { Share2 } from 'lucide-react';

interface Props {
  shareData: ShareData;
}

export const ShareButton = ({ shareData }: Props) => {
  const canShare = navigator?.canShare(shareData);
  if (!canShare) return null;
  return (
    <Button
      onPress={async () => {
        try {
          await navigator.share(shareData);
        } catch (_) {
          // Ignore as this throws for a bunch of stupid reasons
        }
      }}
    >
      <Icon iconNode={<Share2 />} size={19} />
      Del
    </Button>
  );
};
