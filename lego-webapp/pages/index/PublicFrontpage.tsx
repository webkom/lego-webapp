import {
  Button,
  Card,
  Flex,
  LinkButton,
  Image,
  PageContainer,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import bekk from '~/assets/bekk_black.svg';
import bekkWhite from '~/assets/bekk_white.svg';
import buddyWeekGraphic from '~/assets/frontpage-graphic-buddyweek.png';
import dataGraphic from '~/assets/frontpage-graphic-data.png';
import forCompaniesGraphic from '~/assets/frontpage-graphic-for-companies.png';
import komtekGraphic from '~/assets/frontpage-graphic-komtek.png';
import readmeGraphic from '~/assets/frontpage-graphic-readme.png';
import Auth from '~/components/Auth';
import Banner from '~/components/Banner';
import { readmeIfy } from '~/components/ReadmeLogo';
import LatestReadme from '~/pages/index/LatestReadme';
import Pinned from '~/pages/index/Pinned';
import { itemUrl, renderMeta } from '~/pages/index/utils';
import { fetchCurrentPublicBanner } from '~/redux/actions/BannerActions';
import { fetchData, fetchReadmes } from '~/redux/actions/FrontpageActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCurrentPublicBanner } from '~/redux/slices/banner';
import { selectPinned } from '~/redux/slices/frontpage';
import utilStyles from '~/styles/utilities.module.css';
import CompactEvents from './CompactEvents';
import styles from './PublicFrontpage.module.css';

const PublicFrontpage = () => {
  const dispatch = useAppDispatch();
  const pinned = useAppSelector(selectPinned);

  usePreparedEffect(
    'fetchIndex',
    () =>
      Promise.allSettled([dispatch(fetchReadmes(2)), dispatch(fetchData())]),
    [],
  );

  usePreparedEffect(
    'fetchCurrentPublicBanner',
    () => dispatch(fetchCurrentPublicBanner()),
    [],
  );

  const currentPublicBanner = useAppSelector((state) =>
    selectCurrentPublicBanner(state, true),
  );

  return (
    <PageContainer card={false}>
      {currentPublicBanner && (
        <Banner
          header={currentPublicBanner.header}
          subHeader={currentPublicBanner.subheader}
          link={currentPublicBanner.link}
          color={currentPublicBanner.color}
          countdownEndDate={currentPublicBanner.countdownEndDate || undefined}
          countdownEndMessage={currentPublicBanner.countdownEndMessage || undefined}
        />
      )}
      <div className={styles.wrapper}>
        <Welcome />
        <Card className={styles.login} style={{ gridArea: 'login' }}>
          <Auth />
        </Card>
        <CompactEvents style={{ gridArea: 'events' }} />
        <Card style={{ gridArea: 'hsp' }}>
          <HspInfo />
        </Card>
        <Pinned
          style={{ gridArea: 'article' }}
          item={pinned}
          url={itemUrl(pinned)}
          meta={renderMeta(pinned)}
        />
        <LatestReadme
          expandedInitially
          collapsible={false}
          style={{ gridArea: 'readme' }}
          displayCount={2}
        />
        <UsefulLinks />
      </div>
    </PageContainer>
  );
};

const Welcome = () => (
  <div className={styles.welcome} style={{ gridArea: 'welcome' }}>
    <h1>Velkommen til Abakus</h1>
    <p>
      Abakus er linjeforeningen for studentene ved <i>Datateknologi</i> &
      <i> Cybersikkerhet og datakommunikasjon</i> på NTNU, og drives av
      studenter ved disse studiene.
    </p>
    <p>
      Abakus{"'"} formål er å gi disse studentene veiledning i
      studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU,
      fremme kontakten med næringslivet og bidra med sosiale aktiviteter.
    </p>
    <LinkButton dark href="/pages/info-om-abakus">
      Les mer om oss
    </LinkButton>
  </div>
);

const HspInfo = () => (
  <div className={styles.hsp}>
    <h3>
      <a href="https://www.bekk.no/" target="blank">
        <Image
          className={styles.hspImage}
          src={bekk}
          alt="Bekk sin logo"
          darkThemeSource={bekkWhite}
        />
      </a>
    </h3>
    Hovedsamarbeidspartneren vår er Bekk. Vi i Bekk lager tjenester som hjelper
    mennesker i hver by og bygd, krik og krok, hver eneste dag. Vi er et
    fellesskap. Et fagmiljø. En langsiktig samarbeidspartner.
  </div>
);

const usefulLinksConf = [
  {
    title: `Fadderperioden ${moment().year()}`,
    image: buddyWeekGraphic,
    description:
      'Abakus arrangerer fadderperioden for alle nye studenter, og her kan du lese mer om den og finne annen nyttig informasjon til studiestart.',
    buttonText: 'Les deg opp',
    link: 'https://ny.abakus.no',
    isInternalLink: false,
  },
  {
    title: 'Datateknologi',
    image: dataGraphic,
    description:
      'Datateknologi er en helt sentral del av alle fremtidsrettede teknologier; som for eksempel kunstig intelligens, medisinsk teknologi og søkemotorteknologi.',
    buttonText: 'Sjekk ut studiet',
    link: 'https://www.ntnu.no/studier/mtdt',
    isInternalLink: false,
  },
  {
    title: 'Cybersikkerhet og datakommunikasjon',
    image: komtekGraphic,
    description:
      'Vi bruker stadig mer av livene våre på nett, på jobb som i fritid. Cybersikkerhet og datakommunikasjon blir stadig viktigere i en digital verden.',
    buttonText: 'Sjekk ut studiet',
    link: 'https://www.ntnu.no/studier/mtkom',
    isInternalLink: false,
  },
  {
    title: 'For bedrifter',
    image: forCompaniesGraphic,
    description:
      "Her finner du som bedriftsrepresentant informasjon om Abakus' prosedyrer for bedriftspresentasjoner, og andre nyttige fakta.",
    buttonText: 'Undersøk muligheter',
    link: '/pages/bedrifter/for-bedrifter',
    isInternalLink: true,
  },
  {
    title: 'readme',
    image: readmeGraphic,
    description:
      'Abakus har sitt eget magasin, readme. Her kan du lese om hva vi driver med, og få et innblikk i oss som organisasjon.',
    buttonText: 'Utforsk magasiner',
    link: 'https://readme.abakus.no/',
    isInternalLink: false,
  },
];

const UsefulLinks = () => (
  <div className={styles.links}>
    <h3 className={utilStyles.frontPageHeader}>Nyttige lenker</h3>

    <Flex wrap justifyContent="space-evenly" gap="var(--spacing-lg)">
      {usefulLinksConf.map((item) => (
        <a
          href={item.link}
          key={item.title}
          rel="noreferrer"
          target={item.isInternalLink ? '_self' : '_blank'}
        >
          <Card isHoverable className={styles.usefulLink}>
            <Card.Header className={styles.usefulLinkHeader}>
              {readmeIfy(item.title)}
            </Card.Header>
            <Image
              src={item.image}
              alt={item.title}
              className={styles.usefulLinkGraphic}
            />
            <p className={styles.usefulLinkDescription}>{item.description}</p>
            <Button ghost>{item.buttonText}</Button>
          </Card>
        </a>
      ))}
    </Flex>
  </div>
);

export default PublicFrontpage;
