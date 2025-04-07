import { Card, Flex, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { Helmet } from 'react-helmet-async';
import Banner from '~/components/Banner';
import { ContentSection, ContentMain } from '~/components/Content';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import HTTPError from '~/components/errors/HTTPError';
import { editBanner, fetchAllBanners } from '~/redux/actions/BannerActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllBanners } from '~/redux/slices/banner';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import styles from './BannerOverview.module.css';
import type { Banner as BannerType } from '~/redux/models/Banner';

const BannerOverview = () => {
  const dispatch = useAppDispatch();
  usePreparedEffect('fetchAllBanners', () => dispatch(fetchAllBanners()), [
    dispatch,
  ]);
  const allBanners = useAppSelector((state) => selectAllBanners(state));
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={418} />;

  return (
    <Page
      title={'Bannere'}
      actionButtons={
        <LinkButton href={`/admin/banners/new/`}>Lag ny</LinkButton>
      }
      back={sudoAdminAccess ? { href: '/sudo' } : { href: '/' }}
    >
      <Helmet title={'Bannere'} />
      <ContentSection>
        <ContentMain>
          {allBanners.map((banner) => (
            <BannerItem key={banner.id} banner={banner} />
          ))}
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

const BannerItem = ({ banner }: { banner: BannerType }) => {
  const dispatch = useAppDispatch();

  const togglePublic = () =>
    dispatch(
      editBanner(
        { ...banner, currentPublic: !banner.currentPublic },
        banner.id,
      ),
    ).then(() => dispatch(fetchAllBanners()));

  const togglePrivate = () =>
    dispatch(
      editBanner(
        { ...banner, currentPrivate: !banner.currentPrivate },
        banner.id,
      ),
    ).then(() => dispatch(fetchAllBanners()));

  const countdownDate = banner.countdownEndDate
    ? new Date(banner.countdownEndDate)
    : undefined;

  const validCountdownDate =
    countdownDate && !isNaN(countdownDate.getTime())
      ? countdownDate
      : undefined;

  return (
    <Card hideOverflow className={styles.card}>
      <div className={cx(styles.cardSection, styles.bannerContainer)}>
        <Banner
          header={banner.header}
          subHeader={banner.subheader}
          link={banner.link}
          color={banner.color}
          countdownEndDate={validCountdownDate}
          countdownEndMessage={banner.countdownEndMessage ?? undefined}
        />
      </div>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        gap="var(--spacing-md)"
        className={styles.cardSection}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          gap="var(--spacing-md)"
        >
          <Flex
            column
            gap="var(--spacing-sm)"
            alignItems="center"
            justifyContent="center"
          >
            <h4>Innlogget forside</h4>
            <ToggleSwitch
              checked={banner.currentPrivate}
              onChange={togglePrivate}
            />
          </Flex>
          <Flex
            column
            gap="var(--spacing-sm)"
            alignItems="center"
            justifyContent="center"
          >
            <h4>Offentlig forside</h4>
            <ToggleSwitch
              checked={banner.currentPublic}
              onChange={togglePublic}
            />
          </Flex>
        </Flex>
        <LinkButton
          href={`/admin/banners/${banner.id}/edit/`}
          className={styles.editButton}
        >
          Rediger
        </LinkButton>
      </Flex>
    </Card>
  );
};
export default guardLogin(BannerOverview);
