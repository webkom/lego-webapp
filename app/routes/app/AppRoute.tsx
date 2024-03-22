import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
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

const App = ({ children }: PropsWithChildren) => {
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

      <AppChildren>{children}</AppChildren>

      <PhotoUploadStatus />

      <Footer />
    </div>
  );
};

export default withPreparedDispatch(
  'login',
  (_, dispatch) => dispatch(loginAutomaticallyIfPossible()),
  () => [],
  { runSync: true, serverOnly: true },
)(App);
