import { PageContainer } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import Banner from '~/components/Banner';
import CompactEvents from '~/pages/index/_components/CompactEvents';
import Pinned from '~/pages/index/_components/Pinned';
import Hero from '~/pages/index/_components/public/Hero';
import MainSponsor from '~/pages/index/_components/public/MainSponsor';
import ReadmeShowcase, {
  SHOWCASED_EDITIONS,
} from '~/pages/index/_components/public/ReadmeShowcase';
import UsefulLinks from '~/pages/index/_components/public/UsefulLinks';
import useSectionReveal from '~/pages/index/_components/public/useSectionReveal';
import { itemUrl, renderMeta } from '~/pages/index/utils';
import { fetchCurrentPublicBanner } from '~/redux/actions/BannerActions';
import { fetchData, fetchReadmes } from '~/redux/actions/FrontpageActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCurrentPublicBanner } from '~/redux/slices/banner';
import { selectPinned } from '~/redux/slices/frontpage';
import styles from './PublicFrontpage.module.css';

const PublicFrontpage = () => {
  const dispatch = useAppDispatch();
  const pinned = useAppSelector(selectPinned);

  // CompactEvents and Pinned are shared with the authenticated frontpage, so
  // their reveals live on wrappers here rather than inside the components
  const eventsRevealRef = useSectionReveal<HTMLDivElement>();
  const pinnedRevealRef = useSectionReveal<HTMLDivElement>();

  usePreparedEffect(
    'fetchIndex',
    () =>
      Promise.allSettled([
        dispatch(fetchReadmes(SHOWCASED_EDITIONS)),
        dispatch(fetchData()),
      ]),
    [],
  );

  usePreparedEffect(
    'fetchCurrentPublicBanner',
    () => dispatch(fetchCurrentPublicBanner()),
    [],
  );

  const currentPublicBanner = useAppSelector(selectCurrentPublicBanner);

  return (
    <>
      {currentPublicBanner && (
        <div className={styles.banner}>
          <Banner
            header={currentPublicBanner.header}
            subHeader={currentPublicBanner.subheader}
            link={currentPublicBanner.link}
            color={currentPublicBanner.color}
            countdownEndDate={currentPublicBanner.countdownEndDate || undefined}
            countdownEndMessage={
              currentPublicBanner.countdownEndMessage || undefined
            }
          />
        </div>
      )}
      {/* Outside PageContainer so the bead background can bleed past
          --lego-max-width */}
      <Hero />
      <MainSponsor />
      <PageContainer card={false}>
        <div className={styles.wrapper}>
          <div style={{ gridArea: 'events' }} ref={eventsRevealRef}>
            <CompactEvents />
          </div>
          <div style={{ gridArea: 'article' }} ref={pinnedRevealRef}>
            <Pinned
              item={pinned}
              url={itemUrl(pinned)}
              meta={renderMeta(pinned)}
            />
          </div>
          <ReadmeShowcase style={{ gridArea: 'readme' }} />
          <UsefulLinks style={{ gridArea: 'links' }} />
        </div>
      </PageContainer>
    </>
  );
};

export default PublicFrontpage;
