import buddyWeekGraphic from 'app/assets/frontpage-graphic-buddyweek.png';
import dataGraphic from 'app/assets/frontpage-graphic-data.png';
import forCompaniesGraphic from 'app/assets/frontpage-graphic-for-companies.png';
import komtekGraphic from 'app/assets/frontpage-graphic-komtek.png';
import readmeGraphic from 'app/assets/frontpage-graphic-readme.png';
import netcompany from 'app/assets/netcompany_dark.png';
import AuthSection from 'app/components/AuthSection/AuthSection';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import { Image } from 'app/components/Image';
import { Container, Flex } from 'app/components/Layout';
import { readmeIfy } from 'app/components/ReadmeLogo';
import type { Readme } from 'app/models';
import type { WithDocumentType } from 'app/reducers/frontpage';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import { OverviewItem as Article } from 'app/routes/articles/components/Overview';
import LatestReadme from 'app/routes/overview/components/LatestReadme';
import type { PublicEvent } from 'app/store/models/Event';
import CompactEvents from './CompactEvents';
import styles from './PublicFrontpage.css';
// import Banner, { COLORS } from 'app/components/Banner';

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

const isArticle = (
  item:
    | WithDocumentType<ArticleWithAuthorDetails>
    | WithDocumentType<PublicEvent>
): item is WithDocumentType<ArticleWithAuthorDetails> =>
  item.documentType === 'article';

const PublicFrontpage = ({ frontpage, readmes }: Props) => {
  return (
    <Container>
      {/* <Banner
           header="Abakusrevyen har opptak!"
           subHeader="Søk her"
           link="https://opptak.abakus.no"
           color={COLORS.red}
          /> */}
      <Container className={styles.container}>
        <Card style={{ gridArea: 'welcome' }}>
          <Welcome />
        </Card>
        <Card style={{ gridArea: 'login' }}>
          <AuthSection />
        </Card>
        <Card style={{ gridArea: 'events' }}>
          <CompactEvents events={frontpage.filter(isEvent)} frontpageHeading />
        </Card>
        <Card style={{ gridArea: 'hsp' }}>
          <HspInfo />
        </Card>
        <Card style={{ gridArea: 'article' }}>
          <LatestArticle frontpage={frontpage} />
        </Card>
        <LatestReadme
          imageClassName={styles.latestReadme}
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
  <>
    <h2 className="u-mb">Velkommen til Abakus</h2>
    <p>
      Abakus er linjeforeningen for studentene ved <i>Datateknologi</i> og
      <i> Kommunikasjonsteknologi og digital sikkerhet</i> på NTNU, og drives av
      studenter ved disse studiene.
    </p>
    <p>
      Abakus{"'"} formål er å gi disse studentene veiledning i
      studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU,
      fremme kontakten med næringslivet og bidra med sosiale aktiviteter.
    </p>
  </>
);

const HspInfo = () => (
  <div className={styles.hsp}>
    <h3>
      <a href="https://www.netcompany.com/no" target="blank">
        <Image className={styles.hspImage} src={netcompany} alt="NETCOMPANY" />
      </a>
    </h3>
    Hovedsamarbeidspartneren vår er Netcompany. Hos Netcompany står fag,
    innovasjon og samhold sterkt, og de er opptatt av å ta ansvar – både for
    egne leveranser, for kundene og for sine ansatte.
  </div>
);

const LatestArticle = ({ frontpage }: Pick<Props, 'frontpage'>) => (
  <>
    <h2 className="u-mb">Siste artikkel</h2>
    {frontpage
      .filter(isArticle)
      .slice(0, 1)
      .map((item) => (
        <Article article={item} key={item.id} />
      ))}
  </>
);

const usefulLinksConf = [
  {
    title: 'Fadderperioden 2022',
    image: buddyWeekGraphic,
    description:
      'Abakus arrangerer fadderperioden for alle nye studenter, og her finner du informasjon om fadderperioden 2022.',
    buttonText: 'Les deg opp',
    link: '/articles/414',
    isInternalLink: true,
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
    title: 'Kommunikasjonsteknologi og digital sikkerhet',
    image: komtekGraphic,
    description:
      'Vi bruker stadig mer av livene våre på nett, på jobb som i fritid. Kommunikasjonsteknologi og digital sikkerhet blir stadig viktigere i en digital verden.',
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
  <>
    <h2 className="u-mb">Nyttige lenker</h2>

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
  </>
);

export default PublicFrontpage;
