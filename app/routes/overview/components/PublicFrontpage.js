//@flow
import React, { Fragment, Component } from 'react';
import { Container, Flex } from 'app/components/Layout';
import { Image } from 'app/components/Image';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm
} from 'app/components/LoginForm';
import styles from './PublicFrontpage.css';
import bekkLogo from 'app/assets/bekk_small.png';
import { Link } from 'react-router';

import type { Article } from 'app/models';

type Props = { fp: Article };
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
    const { fp = {} } = this.props;

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

    return (
      <Fragment>
        <Container>
          <Flex wrap justifyContent="space-between" className={styles.root}>
            <div className={styles.smallWelcomeBox}>
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
            <div className={styles.bigWelcomeBox}>
              <h2 className={`${styles.header} u-mb`}>
                Velkommen til Abakus
                <a href="https://bekk.no">
                  <img className={styles.sponsor} src={bekkLogo} alt="BEKK" />
                </a>
              </h2>
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
          </Flex>

          <Flex wrap className={styles.bottomContainer}>
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
                  <a href="https://www.ntnu.no/studier/mtdt">
                    <i className="fa fa-caret-right" /> Om Datateknologi
                  </a>
                  <div className={styles.linkDescription}>
                    Datateknologi er en helt sentral del av alle fremtidsrettede
                    teknologier, som for eksempel kunstig intelligens, medisinsk
                    teknologi og søkemotorteknologi.
                  </div>
                </li>
                <li>
                  <a href="http://www.ntnu.no/studier/mtkom">
                    <i className="fa fa-caret-right" /> Om
                    Kommunikasjonsteknologi
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
                    Her finner du som bedriftsrepresentant informasjon om Abakus{
                      "' "
                    }
                    prosedyrer for bedriftspresentasjoner og andre nyttige
                    fakta.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.facebook}>
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
