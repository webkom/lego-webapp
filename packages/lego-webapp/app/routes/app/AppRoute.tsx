import { Provider as LegoBricksProvider } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { fetchMeta } from 'app/actions/MetaActions';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import coverPhoto from 'app/assets/cover.png';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Footer from 'app/components/Footer';
import Header from 'app/components/Header';
import PhotoUploadStatus from 'app/components/PhotoUploadStatus';
import ToastProvider from 'app/components/Toast/ToastProvider';
import { setStatusCode } from 'app/reducers/routing';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { useTheme } from 'app/utils/themeUtils';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import appConfig from '~/utils/appConfig';
import HTTPError from '../errors/HTTPError';
import styles from './AppRoute.module.css';
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
        <ToastProvider />
        {statusCode ? <HTTPError statusCode={statusCode} /> : <>{children}</>}
      </ErrorBoundary>
    </div>
  );
};

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  usePreparedEffect('fetchMeta', () => dispatch(fetchMeta()), [], {
    serverOnly: true,
  });

  return (
    <LegoBricksProvider theme={theme} navigate={navigate}>
      <div className={styles.appRoute}>
        <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no">
          <meta property="og:image" content={coverPhoto} />
          <meta
            property="og:description"
            content="Abakus er linjeforeningen for studentene ved Datateknologi & Cybersikkerhet og datakommunikasjon på NTNU, og drives av studenter ved disse studiene."
          />
        </Helmet>

        {appConfig.environment !== 'production' && (
          <div
            id="development-banner"
            style={{
              backgroundColor: 'var(--danger-color)',
              color: 'white',
              fontWeight: '500',
              padding: 'var(--spacing-sm)',
              lineHeight: '1.3',
            }}
          >
            This is a development version of lego-webapp.
          </div>
        )}

        <Header />

        <AppChildren>
          <Outlet />
        </AppChildren>

        <PhotoUploadStatus />

        <Footer />
      </div>
    </LegoBricksProvider>
  );
};

export default withPreparedDispatch(
  'login',
  (_, dispatch) => dispatch(loginAutomaticallyIfPossible()),
  () => [],
  { runSync: true, serverOnly: true },
)(App);
