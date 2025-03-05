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
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error('Kunne ikke dele:', error);
      }
    } else {
      {
        navigator.clipboard.writeText(url);
      }
      dispatch(
        addToast({
          message: 'Link er kopiert til utklippstavlen',
          type: 'success',
          dismissAfter: 10000,
        }),
      );
    }
  };

  return (
    <Button onPress={handleShare}>
      <Flex justifyContent="center">
        <Icon name="share" iconNode={<ShareIcon />} size={20} />
      </Flex>
    </Button>
  );
};

export default ShareButton;
