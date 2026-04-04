import { Flex } from '@webkom/lego-bricks';
import eggImage from '~/assets/interest-group-logos/6169555d9248be7e184f52250129b0d66c9932af74f4ac7bc716c20013fca362.png';

const Egg = () => {
  return (
    <Flex alignItems="center" column>
      <img
        src={eggImage}
        alt="An image was supposed to be here but is not"
        width={200}
      />
    </Flex>
  );
};

export default Egg;
