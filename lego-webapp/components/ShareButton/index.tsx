import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { ShareIcon } from 'lucide-react';
import { useAppDispatch } from 'lego-webapp/redux/hooks';
import { addToast } from '~/redux/slices/toasts';

type Props = {
  title: string;
  url: string;
};

const ShareButton: React.FC<Props> = ({ title, url }) => {
  const dispatch = useAppDispatch();
  const handleShare = async () => {
    if (navigator?.canShare?.({ title, url })) {
      navigator.share({ title, url });
    } else {
      {
        navigator.clipboard.writeText(url);
      }
      dispatch(
        addToast({
          message: 'Link er kopiert til utklippstavlen',
          type: 'success',
        }),
      );
    }
  };

  return (
    <Button onPress={handleShare}>
      <Flex justifyContent="center" gap="var(--spacing-sm)">
        <Icon iconNode={<ShareIcon />} size={20} />
        {title}
      </Flex>
    </Button>
  );
};

export default ShareButton;
