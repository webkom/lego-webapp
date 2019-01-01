//@flow
import React, { Fragment, Component } from 'react';
import { Container, Flex } from 'app/components/Layout';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm
} from 'app/components/LoginForm';
import styles from './PublicFrontpage.css';
import netcompany from 'app/assets/netcompany_dark.png';
import CompactEvents from './CompactEvents';
import { Link } from 'react-router';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import Time from 'app/components/Time';

type Props = {
  frontpage: Array<Object>,
  readmes: Array<Object>
};

type State = {
  registerUser: boolean,
  forgotPassword: boolean
};

class PublicFrontpage extends Component<Props, State> {
  state = {
    registerUser: false,
    forgotPassword: false
  };

  toggleRegisterUser = () => this.setState({ registerUser: true });

  toggleForgotPassword = () => this.setState({ forgotPassword: true });

  toggleBack = () =>
    this.setState({ registerUser: false, forgotPassword: false });

  render() {
    const { registerUser, forgotPassword } = this.state;
    const isEvent = item => item.documentType === 'event';
    const isArticle = item => item.documentType === 'article';

    const topArticle = this.props.frontpage
      .filter(isArticle)
      .slice(0, 1)
      .map(item => (
        <div key={item.id} className={styles.innerArticle}>
          <div className={styles.articleTitle}>
            <h4
              style={{
                whiteSpace: 'pre',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {truncateString(item.title, 60)}
            </h4>
            <h5
              style={{
                whiteSpace: 'pre',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <Time format="dd D.MM" time={item.createdAt} />
            </h5>
          </div>
          <Link to={`/articles/${item.id}`}>
            <Image src={item.cover} />
          </Link>
          {truncateString(item.description, 500)}
        </div>
      ));

    let title, form;
    if (registerUser) {
      title = 'Registrer bruker';
      form = <RegisterForm />;
    } else if (forgotPassword) {
      title = 'Glemt passord';
      form = <ForgotPasswordForm />;
    } else {
      title = 'Logg inn';
      form = <LoginForm />;
    }
    const [latestReadme] = this.props.readmes || [];

    return (
      <Fragment>
        <Container>
          <Flex wrap className={styles.cardFlex}>
            <div className={styles.welcome}>
              <h2 className={'u-mb'}>Velkommen til Abakus</h2>
              <p>
                Abakus er linjeforeningen for studentene ved Datateknologi og
                Kommunikasjonsteknologi på NTNU, og drives av studenter ved
                disse studiene.
              </p>
              <p>
                Abakus
                {"'"} formål er å gi disse studentene veiledning i
                studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved
                NTNU, fremme kontakten med næringslivet og bidra med sosiale
                aktiviteter.
              </p>
            </div>
            <div className={styles.loginForm}>
              <Flex
                component="h2"
                justifyContent="space-between"
                alignItems="center"
                className="u-mb"
                style={{ whiteSpace: 'nowrap' }}
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
          </Flex>

          <Flex wrap className={styles.cardFlex}>
            <div className={styles.events}>
              <CompactEvents
                events={this.props.frontpage.filter(isEvent)}
                frontpageHeading
                titleMaxLength={20}
              />
            </div>

            <div className={styles.cooperator}>
              <a href="https://www.netcompany.com/no" target="blank">
                <img
                  className={styles.sponsor}
                  src={netcompany}
                  alt="NETCOMPANY"
                />
              </a>{' '}
              Vår nye hovedsamarbeidspartner er Netcompany. Hos Netcompany står
              fag, innovasjon og samhold sterkt, og de er opptatt av å ta ansvar
              – både for egne leveranser, for kundene og for sine ansatte.
            </div>
          </Flex>

          <Flex wrap className={styles.cardFlex}>
            <div className={styles.articles}>
              <h2 className="u-mb">Siste artikkel</h2>
              {topArticle}
            </div>

            <div className={styles.readme}>
              <h2 className="u-mb">Siste utgave av vårt magasin</h2>
              <a
                href={latestReadme && latestReadme.pdf}
                className={styles.thumb}
                style={{ display: 'block' }}
              >
                <Image src={latestReadme && latestReadme.image} />
              </a>
            </div>
          </Flex>

          <Flex wrap className={styles.cardFlex}>
            <div className={styles.usefulLinks}>
              <h2 className="u-mb">Nyttige linker</h2>
              <ul>
                <li>
                  <Link to="/articles/127">
                    <i className="fa fa-caret-right" /> Fadderperioden 2018
                  </Link>
                  <div className={styles.linkDescription}>
                    Informasjon om fadderperioden 2018
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
                    <i className="fa fa-caret-right" /> Kommunikasjonsteknologi
                  </a>
                  <div className={styles.linkDescription}>
                    Vi bruker stadig mer av livene våre på nett, på jobb som i
                    fritid. Kommunikasjonsteknologi brukes etter hvert av alle
                    og overalt.
                  </div>
                </li>
                <li>
                  <Link to="/pages/info/for-bedrifter">
                    <i className="fa fa-caret-right" /> For bedrifter
                  </Link>
                  <div className={styles.linkDescription}>
                    Her finner du som bedriftsrepresentant informasjon om Abakus
                    {"' "}
                    prosedyrer for bedriftspresentasjoner og andre nyttige
                    fakta.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.facebook}>
              <h2 className="u-mb">Vår Facebook side</h2>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAbakusNTNU%2F&amp;tabs=timeline&amp;width=420&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId=1717809791769695"
                style={{
                  border: 'none',
                  overflow: 'hidden',
                  height: '500px',
                  width: '420px'
                }}
                title="facebook"
                scrolling="no"
                frameBorder="0"
                allowTransparency="true"
              />
            </div>
          </Flex>
        </Container>
      </Fragment>
    );
  }
}

export default PublicFrontpage;
