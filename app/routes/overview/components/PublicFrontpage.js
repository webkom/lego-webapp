import React from 'react';
import { Content, Flex } from 'app/components/Layout';
import LoginForm from 'app/components/LoginForm';
import styles from './PublicFrontpage.css';

function PublicFrontpage() {
  return (
    <Content>
      <Flex justifyContent="space-between" className={styles.root}>
        <div className={styles.smallWelcomeBox}>
          <Flex
            component="h2"
            justifyContent="space-between"
            alignItems="center"
            className="u-mb"
            style={{ whiteSpace: 'nowrap' }}
          >
            Logg inn <a href="" className="u-small">Jeg er ny →</a>
          </Flex>
          <LoginForm />
        </div>
        <div className={styles.bigWelcomeBox}>
          <h2 className="u-mb">Velkommen til Abakus</h2>
          <p>
            Abakus er linjeforeningen for studentene ved Datateknologi og
            Kommunikasjonsteknologi på NTNU, og drives av studenter ved disse
            studiene.
          </p>
          <p>
            Abakus
            {"'"} formål er å gi disse studentene veiledning i
            studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU,
            fremme kontakten med næringslivet og bidra med sosiale aktiviteter.
          </p>
        </div>
      </Flex>

      <Flex className={styles.bottomContainer}>
        <div className={styles.usefulLinks}>
          <h2 className="u-mb">Nyttige linker</h2>
          <ul>
            <li>
              <a href="https://www.ntnu.no/innsida/">
                <i className="fa fa-caret-right" /> innsida
              </a>
              <div className={styles.linkDescription}>
                Innsida er kjappeste vei inn til andre system og tjenester. Logger man seg på Innsida, blir man samtidig pålogget andre system.
              </div>
            </li>
            <li>
              <a href="https://www.ntnu.no/studier/mtdt">
                <i className="fa fa-caret-right" /> Om Datateknikk
              </a>
              <div className={styles.linkDescription}>
                Datateknologi er en helt sentral del av alle fremtidsrettede teknologier, som for eksempel kunstig intelligens, medisinsk teknologi og søkemotorteknologi.
              </div>
            </li>
            <li>
              <a href="http://www.ntnu.no/studier/mtkom">
                <i className="fa fa-caret-right" /> Om Kommunikasjonsteknologi
              </a>
              <div className={styles.linkDescription}>
                Vi bruker stadig mer av livene våre på nett, på jobb som i fritid. Kommunikasjonsteknologi brukes etter hvert av alle og overalt.
              </div>
            </li>
          </ul>
        </div>

        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAbakusNTNU%2F&amp;tabs=timeline&amp;width=420&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId=1717809791769695"
          style={{
            border: 'none',
            overflow: 'hidden',
            height: '500px',
            width: '420px'
          }}
          scrolling="no"
          frameBorder="0"
          allowTransparency="true"
        />
      </Flex>

    </Content>
  );
}

export default PublicFrontpage;
