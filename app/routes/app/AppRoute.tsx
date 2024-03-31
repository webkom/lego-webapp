import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { fetchMeta } from 'app/actions/MetaActions';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import coverPhoto from 'app/assets/cover.png';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Footer from 'app/components/Footer';
import Header from 'app/components/Header';
import PhotoUploadStatus from 'app/components/PhotoUploadStatus';
import ToastContainer from 'app/components/Toast/ToastContainer';
import config from 'app/config';
import { setStatusCode } from 'app/reducers/routing';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import HTTPError from '../errors/HTTPError';
import styles from './AppRoute.css';
import type { PropsWithChildren } from 'react';
import { Flex, Icon } from '@webkom/lego-bricks';
import { Image } from 'app/components/Image';
import hated_man from 'app/assets/idi_hater_ham.png';
import piller from 'app/assets/piller.png';
import abagail from 'app/assets/abagail.png';
import { useCurrentUser } from 'app/reducers/auth';
import { applySelectedTheme } from 'app/utils/themeUtils';

const AppChildren = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const statusCode = useAppSelector((state) => state.router.statusCode);
  const location = useLocation();

  // Clear status code when navigating
  useEffect(() => {
    if (statusCode != null) {
      dispatch(setStatusCode(null));
    }
    // We don't want to run this effect when the status code changes (that would instantly clear it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.pathname]);

  const currentUser = useCurrentUser();
  useEffect(() => {
    if (currentUser && currentUser.isStudent) {
      applySelectedTheme('abahub');
    }
  }, [currentUser]);

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <ErrorBoundary resetOnChange={location}>
        <ToastContainer />
        {statusCode ? <HTTPError statusCode={statusCode} /> : <>{children}</>}
      </ErrorBoundary>
    </div>
  );
};

const App = () => {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const searchOpen = useAppSelector((state) => state.search.open);

  usePreparedEffect('fetchMeta', () => dispatch(fetchMeta()), [], {
    serverOnly: true,
  });

  return (
    <div
      className={cx(styles.appRoute, {
        [styles.searchOpen]: searchOpen,
      })}
    >
      <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no">
        <meta property="og:image" content={coverPhoto} />
        <meta
          property="og:description"
          content="Abakus er linjeforeningen for studentene ved Datateknologi & Cybersikkerhet og datakommunikasjon på NTNU, og drives av studenter ved disse studiene."
        />
      </Helmet>

      {config.environment !== 'production' && (
        <div
          style={{
            backgroundColor: 'var(--danger-color)',
            color: 'white',
            fontWeight: 'bold',
            padding: 'var(--spacing-sm)',
          }}
        >
          This is a development version of lego-webapp.
        </div>
      )}

      <Header />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: '920px',
            zIndex: '10',
            pointerEvents: 'none',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'sticky',
            left: '0',
            top: '30px',
          }}
        >
          {currentUser?.isStudent && (
            <>
              <AdSidebar>
                <Ad className={styles.adAbakuse}>
                  <div>
                    <h1>SINGLE ABAKUSER</h1>
                    <h2>I DITT OMRÅDE</h2>
                  </div>
                  <Image src={abagail} />
                  <div>
                    <h2>Abagail Kusner er...</h2>
                    <h1 className={styles.adAbakuseDesc}>600 meter unna</h1>
                  </div>
                  <h1>
                    <a href="https://bit.ly/3BlS71b">SNAKK MED HENNE NÅ</a>
                  </h1>
                </Ad>
                <Ad className={styles.adKok}>
                  <h1>LAST NED GRATIS KOK</h1>
                  <AdButton title="KLIKK HER" />
                </Ad>
              </AdSidebar>
              <AdSidebar>
                <Ad className={styles.adRapport}>
                  <h1>ER RAPPORTEN DIN FOR KORT?</h1>
                  <h2>
                    Dette hjelpemiddelet øker lengden på rapporten din med 690
                    ord!
                  </h2>
                  <Image src={piller} alt="" />
                  <AdButton title="PRØV DET UT" />
                </Ad>
                <Ad className={styles.adHater}>
                  <h1>NTNU-STABEN HATER HAM</h1>
                  <Image src={hated_man} alt="" />
                  <h2>
                    Han fant det hemmelige rommet ved hjelp av ETT ENKELT TRIKS
                  </h2>
                  <h2>
                    Les mer <a href="https://bit.ly/3BlS71b">her</a>
                  </h2>
                </Ad>
              </AdSidebar>
            </>
          )}
        </div>
        <div style={{ marginTop: '-920px' }}>
          <AppChildren>
            <Outlet />
          </AppChildren>
        </div>
      </div>

      <PhotoUploadStatus />

      <Footer />
    </div>
  );
};

const AdButton = ({ title, color }: { title: string; color?: string }) => {
  return (
    <a href="https://bit.ly/3BlS71b">
      <button className={styles.adButton}>{title}</button>
    </a>
  );
};

const AdSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex column gap="0.5rem">
      {children}
    </Flex>
  );
};

const Ad = ({ children, className }) => {
  return (
    <Flex column className={styles.ad}>
      <Flex justifyContent="space-between" padding="0 0.3rem">
        <p>Advertisement</p>
        <a href="https://bit.ly/3BlS71b">
          <Icon name="close-outline" />
        </a>
      </Flex>
      <Flex column className={className} padding="1rem 0">
        {children}
      </Flex>
    </Flex>
  );
};

export default withPreparedDispatch(
  'login',
  (_, dispatch) => dispatch(loginAutomaticallyIfPossible()),
  () => [],
  { runSync: true, serverOnly: true },
)(App);
