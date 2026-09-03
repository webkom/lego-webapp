import Spotlight from '~/components/Spotlight';
import { toSpotlightItems } from '~/pages/index/utils';
import { useAppSelector } from '~/redux/hooks';
import { selectFeaturedItems } from '~/redux/slices/frontpage';
import type { CSSProperties } from 'react';

type Props = {
  style?: CSSProperties;
};

const FrontpageSpotlight = ({ style }: Props) => {
  const featured = useAppSelector(selectFeaturedItems);
  const fetching = useAppSelector((state) => state.frontpage.fetching);

  return (
    <Spotlight
      items={toSpotlightItems(featured)}
      fetching={fetching}
      style={style}
    />
  );
};

export default FrontpageSpotlight;
