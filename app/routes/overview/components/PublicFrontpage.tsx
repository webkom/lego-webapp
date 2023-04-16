import { Link } from 'react-router-dom';
import netcompany from 'app/assets/netcompany_dark.png';
import AuthSection from 'app/components/AuthSection/AuthSection';
import Card from 'app/components/Card';
import { Image } from 'app/components/Image';
import { Container } from 'app/components/Layout';
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
        <Card style={{ gridArea: 'links' }}>
          <UsefulLinks />
        </Card>
      </Container>
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

const UsefulLinks = () => (
  <>
    <h2 className="u-mb">Nyttige lenker</h2>
    <ul>
      <li>
        <Link to="/articles/414">
          <i className="fa fa-caret-right" /> Fadderperioden 2022
        </Link>
        <div className={styles.linkDescription}>
          Informasjon om fadderperioden 2022
        </div>
      </li>
      <li>
        <a href="https://www.ntnu.no/studier/mtdt" target="blank">
          <i className="fa fa-caret-right" /> Datateknologi
        </a>
        <div className={styles.linkDescription}>
          Datateknologi er en helt sentral del av alle fremtidsrettede
          teknologier, som for eksempel kunstig intelligens, medisinsk teknologi
          og søkemotorteknologi.
        </div>
      </li>
      <li>
        <a href="http://www.ntnu.no/studier/mtkom" target="blank">
          <i className="fa fa-caret-right" /> Kommunikasjonsteknologi og digital
          sikkerhet
        </a>
        <div className={styles.linkDescription}>
          Vi bruker stadig mer av livene våre på nett, på jobb som i fritid.
          Kommunikasjonsteknologi og digital sikkerhet blir stadig viktigere i
          en digital verden.
        </div>
      </li>
      <li>
        <Link to="/pages/bedrifter/for-bedrifter">
          <i className="fa fa-caret-right" /> For bedrifter
        </Link>
        <div className={styles.linkDescription}>
          Her finner du som bedriftsrepresentant informasjon om Abakus{"' "}
          prosedyrer for bedriftspresentasjoner og andre nyttige fakta.
        </div>
      </li>
      <li>
        <a href="https://readme.abakus.no">
          <i className="fa fa-caret-right" /> {readmeIfy('readme')}
        </a>
        <div className={styles.linkDescription}>
          Abakus har sitt eget magasin skrevet av {readmeIfy('readme')}. Her kan
          du lese om hva abakus driver med og få et innblikk i abakus som
          organisasjon.
        </div>
      </li>
    </ul>
  </>
);

export default PublicFrontpage;
