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
      <div style={{position: "relative"}}>
        <div style={{height: "800px", zIndex: "10", pointerEvents: "none", paddingLeft: "2rem", paddingRight: "2rem", display: "flex", justifyContent: "space-between", position: "sticky", left: "0", top: "30px"}}>
          <AdSidebar>
            <Ad className={styles.adAbakuse}>
              <div>
                <h1>SINGLE ABAKUSER</h1>
                <h2>I NÆRHETEN AV DEG</h2>
              </div>
              <img style={{height: "300px", width: "220px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbWJr7qAVgTm9ePt_nCTDNQlNMDJDW3em0td82iFmP2Zg5veyk6KeZRs1ZO2plGj77KQ&usqp=CAU"/>
            </Ad>
            <Ad className={styles.adRapport}>
              <h1>ER RAPPORTEN DIN FOR KORT?</h1>
              <h2>Dette hjelpemiddelet øker lengden på rapporten din med 800 ord!</h2>
              <img style={{height:"200px", width: "100%"}} src="https://images.unsplash.com/photo-1607077792448-17b60bcca65f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBpbGx8ZW58MHx8MHx8fDA%3D"/>
              <AdButton title="PRØV DET UT"/>
            </Ad>
          </AdSidebar>
          <AdSidebar>
            <Ad className={styles.adKok}>
              <h1>LAST NED GRATIS KOK</h1>
              <AdButton title="LAST NED"/>
            </Ad>
            <Ad className={styles.adKok}>
              <img style={{height: "800px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbWJr7qAVgTm9ePt_nCTDNQlNMDJDW3em0td82iFmP2Zg5veyk6KeZRs1ZO2plGj77KQ&usqp=CAU"/>
            </Ad>
            <Ad className={styles.adKok}>

            </Ad>
          </AdSidebar>
        </div>
        <div style={{ marginTop: "-800px"}}>
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

const AdButton = ({title}) => {
    return (
      <button className={styles.adButton}>
        {title}
      </button>
    )
}

const AdSidebar = ({children}: {children: React.ReactNode}) => {
    return (
        <Flex column gap="0.5rem">
          {children}
        </Flex>
    );
}

const Ad = ({children, className}) => {
    return (
        <Flex column className={styles.ad}>
          <Flex justifyContent='space-between' padding="0 0.3rem">
            <p>Advertisement</p>
            <Icon name="close-outline"/>
          </Flex>
          <Flex column className={className} padding="1rem 0">
            {children}
          </Flex>
        </Flex>
    );
}

export default withPreparedDispatch(
  'login',
  (_, dispatch) => dispatch(loginAutomaticallyIfPossible()),
  () => [],
  { runSync: true, serverOnly: true },
)(App);
