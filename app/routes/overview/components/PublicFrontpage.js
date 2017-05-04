import React from 'react';
import { Content, Flex } from 'app/components/Layout';
import LoginForm from 'app/components/LoginForm';
import styles from './PublicFrontpage.css';

function PublicFrontpage() {
  return (
    <Content style={{ paddingBottom: '20px' }}>
      <Flex justifyContent="space-between" className={styles.root}>
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
        <div className={styles.smallWelcomeBox}>
          <Flex
            component="h2"
            justifyContent="space-between"
            alignItems="center"
            className="u-mb"
            style={{ whiteSpace: 'nowrap' }}
          >
            Logg inn{' '}
            <a href="" className="u-small">
              Jeg er ny →
            </a>
          </Flex>
          <LoginForm />
        </div>
      </Flex>

    </Content>
  );
}

export default PublicFrontpage;
