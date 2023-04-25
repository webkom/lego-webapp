import { Component } from 'react';
import { Link } from 'react-router-dom';
import netcompany from 'app/assets/netcompany_dark.png';
import { Image } from 'app/components/Image';
import { Container, Flex } from 'app/components/Layout';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from 'app/components/LoginForm';
import { readmeIfy } from 'app/components/ReadmeLogo';
import Time from 'app/components/Time';
import truncateString from 'app/utils/truncateString';
import CompactEvents from './CompactEvents';
import styles from './PublicFrontpage.css';
// import Banner, { COLORS } from 'app/components/Banner';
type Props = {
  frontpage: Array<Record<string, any>>;
  readmes: Array<Record<string, any>>;
};
type State = {
  registerUser: boolean;
  forgotPassword: boolean;
};

class PublicFrontpage extends Component<Props, State> {
  state = {
    registerUser: false,
    forgotPassword: false,
  };
  toggleRegisterUser = () =>
    this.setState({
      registerUser: true,
    });
  toggleForgotPassword = () =>
    this.setState({
      forgotPassword: true,
    });
  toggleBack = () =>
    this.setState({
      registerUser: false,
      forgotPassword: false,
    });

  render() {
    const { registerUser, forgotPassword } = this.state;

    const isEvent = (item) => item.documentType === 'event';

    const isArticle = (item) => item.documentType === 'article';

    const topArticle = this.props.frontpage
      .filter(isArticle)
      .slice(0, 1)
      .map((item) => (
        <div key={item.id} className={styles.innerArticle}>
          <div className={styles.articleTitle}>
            <h4>{truncateString(item.title, 60)}</h4>
            <h5
              style={{
                whitespace: 'pre',
              }}
            >
              <Time format="dd D.MM" time={item.createdAt} />
            </h5>
          </div>
          <Link to={`/articles/${item.id}`}>
            <Image src={item.cover} placeholder={item.coverPlaceholder} />
          </Link>
          {truncateString(item.description, 500)}
        </div>
      ));
    const title = registerUser
      ? 'Registrer bruker'
      : forgotPassword
      ? 'Glemt passord'
      : 'Logg inn';
    const form = registerUser ? (
      <RegisterForm />
    ) : forgotPassword ? (
      <ForgotPasswordForm />
    ) : (
      <LoginForm />
    );
    const [latestReadme] = this.props.readmes || [];
    return (
      <Container>
        {/* <Banner
         header="Abakusrevyen har opptak!"
         subHeader="Søk her"
         link="https://opptak.abakus.no"
         color={COLORS.red}
        /> */}
        <Container className={styles.container}>
          <div className={styles.welcome}>
            <h2 className="u-mb">Velkommen til Abakus</h2>
            <p>
              Abakus er linjeforeningen for studentene ved <i>Datateknologi</i>{' '}
              og
              <i> Kommunikasjonsteknologi og digital sikkerhet</i> på NTNU, og
              drives av studenter ved disse studiene.
            </p>
            <p>
              Abakus
              {"'"} formål er å gi disse studentene veiledning i
              studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved
              NTNU, fremme kontakten med næringslivet og bidra med sosiale
              aktiviteter.
            </p>
          </div>
          <div className={styles.login}>
            <Flex
              component="h2"
              justifyContent="space-between"
              alignItems="center"
              className="u-mb"
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {title}
              {!(registerUser || forgotPassword) && (
                <div>
                  <button
                    onClick={this.toggleForgotPassword}
                    className={styles.toggleButton}
                  >
                    Glemt passord
                  </button>
                  <span className={styles.toggleButton}>&bull;</span>
                  <button
                    onClick={this.toggleRegisterUser}
                    className={styles.toggleButton}
                  >
                    Jeg er ny
                  </button>
                </div>
              )}
              {(registerUser || forgotPassword) && (
                <button
                  onClick={this.toggleBack}
                  className={styles.toggleButton}
                >
                  Tilbake
                </button>
              )}
            </Flex>
            {form}
          </div>
          <div className={styles.events}>
            <CompactEvents
              events={this.props.frontpage.filter(isEvent)}
              frontpageHeading
            />
          </div>
          <div className={styles.hsp}>
            <a href="https://www.netcompany.com/no" target="blank">
              <Image
                className={styles.hspImage}
                src={netcompany}
                alt="NETCOMPANY"
              />
            </a>
            Hovedsamarbeidspartneren vår er Netcompany. Hos Netcompany står fag,
            innovasjon og samhold sterkt, og de er opptatt av å ta ansvar – både
            for egne leveranser, for kundene og for sine ansatte.
          </div>
          <div className={styles.article}>
            <h2 className="u-mb">Siste artikkel</h2>
            {topArticle}
          </div>
          <div className={styles.readme}>
            <h2 className="u-mb">Siste utgave av {readmeIfy('readme')} </h2>
            <a
              href={latestReadme && latestReadme.pdf}
              className={styles.thumb}
              style={{
                display: 'block',
              }}
            >
              <Image src={latestReadme && latestReadme.image} />
            </a>
          </div>
          <div className={styles.links}>
            <h2 className="u-mb">Nyttige linker</h2>
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
                  teknologier, som for eksempel kunstig intelligens, medisinsk
                  teknologi og søkemotorteknologi.
                </div>
              </li>
              <li>
                <a href="http://www.ntnu.no/studier/mtkom" target="blank">
                  <i className="fa fa-caret-right" /> Kommunikasjonsteknologi og
                  digital sikkerhet
                </a>
                <div className={styles.linkDescription}>
                  Vi bruker stadig mer av livene våre på nett, på jobb som i
                  fritid. Kommunikasjonsteknologi og digital sikkerhet blir
                  stadig viktigere i en digital verden.
                </div>
              </li>
              <li>
                <Link to="/pages/bedrifter/for-bedrifter">
                  <i className="fa fa-caret-right" /> For bedrifter
                </Link>
                <div className={styles.linkDescription}>
                  Her finner du som bedriftsrepresentant informasjon om Abakus
                  {"' "}
                  prosedyrer for bedriftspresentasjoner og andre nyttige fakta.
                </div>
              </li>
              <li>
                <a href="https://readme.abakus.no">
                  <i className="fa fa-caret-right" /> {readmeIfy('readme')}
                </a>
                <div className={styles.linkDescription}>
                  Abakus har sitt eget magasin skrevet av {readmeIfy('readme')}.
                  Her kan du lese om hva abakus driver med og få et innblikk i
                  abakus som organisasjon.
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.facebook}>
            <h2 className="u-mb">Vår Facebook side</h2>
            <div className={styles.facebookIframeContainer}>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAbakusNTNU%2F&amp;tabs=timeline&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId=1717809791769695"
                className={styles.facebookIframe}
                title="facebook"
                scrolling="no"
                frameBorder="0"
              />
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}

export default PublicFrontpage;
