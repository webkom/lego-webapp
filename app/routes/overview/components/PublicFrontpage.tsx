import { Button, Card, Container, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import buddyWeekGraphic from 'app/assets/frontpage-graphic-buddyweek.png';
import dataGraphic from 'app/assets/frontpage-graphic-data.png';
import forCompaniesGraphic from 'app/assets/frontpage-graphic-for-companies.png';
import komtekGraphic from 'app/assets/frontpage-graphic-komtek.png';
import readmeGraphic from 'app/assets/frontpage-graphic-readme.png';
import netcompany from 'app/assets/netcompany_dark.png';
import netcompanyLight from 'app/assets/netcompany_white.svg';
import AuthSection from 'app/components/AuthSection/AuthSection';
// import Banner from 'app/components/Banner';
import { Image } from 'app/components/Image';
import { readmeIfy } from 'app/components/ReadmeLogo';
import type { Readme } from 'app/models';
import type { WithDocumentType } from 'app/reducers/frontpage';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import LatestReadme from 'app/routes/overview/components/LatestReadme';
import Pinned from 'app/routes/overview/components/Pinned';
import { itemUrl, renderMeta } from 'app/routes/overview/components/utils';
import type { PublicEvent } from 'app/store/models/Event';
import CompactEvents from './CompactEvents';
import styles from './PublicFrontpage.css';

type Props = {
  frontpage: (
    | WithDocumentType<ArticleWithAuthorDetails>
    | WithDocumentType<PublicEvent>
  )[];
  readmes: Array<Readme>;
};

const isEvent = (
  item:
    | WithDocumentType<ArticleWithAuthorDetails>
    | WithDocumentType<PublicEvent>
): item is WithDocumentType<PublicEvent> => item.documentType === 'event';

const PublicFrontpage = ({ frontpage, readmes }: Props) => {
  const pinned = frontpage[0];
  const pinnedComponent = pinned && (
    <Pinned
      style={{ gridArea: 'article' }}
      item={pinned}
      url={itemUrl(pinned)}
      meta={renderMeta(pinned)}
    />
  );

  return (
    <Container>
      {/* <Banner
        header="Abakusrevyen har opptak!"
        subHeader="Søk her"
        link="https://opptak.abakus.no"
        color="red"
      /> */}
      <Container className={styles.container}>
        <Welcome />
        <Card className={styles.login} style={{ gridArea: 'login' }}>
          <AuthSection />
        </Card>
        <CompactEvents
          style={{ gridArea: 'events' }}
          events={frontpage.filter(isEvent)}
        />
        <Card style={{ gridArea: 'hsp' }}>
          <HspInfo />
        </Card>
        {pinnedComponent}
        <LatestReadme
          readmes={readmes}
          expandedInitially
          collapsible={false}
          style={{ gridArea: 'readme' }}
        />
      </Container>
      <UsefulLinks />
    </Container>
  );
};

const Welcome = () => (
  <div className={styles.welcome} style={{ gridArea: 'welcome' }}>
    <h1 className="u-mb">Velkommen til Abakus</h1>
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
    <Link to="/pages/info-om-abakus">
      <Button dark>Les mer om oss</Button>
    </Link>
  </div>
);

const HspInfo = () => (
  <div className={styles.hsp}>
    <h3>
      <a href="https://www.netcompany.com/no" target="blank">
        <Image
          className={styles.hspImage}
          src={netcompany}
          alt="NETCOMPANY"
          darkThemeSource={netcompanyLight}
        />
      </a>
    </h3>
    Hovedsamarbeidspartneren vår er Netcompany. Hos Netcompany står fag,
    innovasjon og samhold sterkt, og de er opptatt av å ta ansvar – både for
    egne leveranser, for kundene og for sine ansatte.
  </div>
);

const usefulLinksConf = [
  {
    title: 'Fadderperioden 2023',
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
    <h3 className="u-ui-heading">Nyttige lenker</h3>

    <Flex wrap justifyContent="center" gap={40}>
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
