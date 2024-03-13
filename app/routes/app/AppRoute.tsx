import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { createContext, useContext, useMemo } from 'react';
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
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import HTTPError from '../errors/HTTPError';
import styles from './AppRoute.css';
import type { CurrentUser } from 'app/store/models/User';
import type { PropsWithChildren } from 'react';

export const UserContext = createContext<{
  currentUser: CurrentUser | Record<string, never>;
  loggedIn: boolean;
}>({
  currentUser: {},
  loggedIn: false,
});

// Extract the type of the user context
export type UserContextType = ReturnType<typeof useUserContext>;

export const useUserContext = () => useContext(UserContext);

const AppChildren = ({ children }: PropsWithChildren) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const loggedIn = useAppSelector(selectIsLoggedIn);

  const userValue = useMemo(
    () => ({
      currentUser,
      loggedIn,
    }),
    [currentUser, loggedIn]
  );

  const statusCode = useAppSelector((state) => state.router.statusCode);
  const location = useLocation();

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <ErrorBoundary resetOnChange={location}>
        <ToastContainer />
        {statusCode ? (
          <HTTPError statusCode={statusCode} />
        ) : (
          <UserContext.Provider value={userValue}>
            {children}
          </UserContext.Provider>
        )}
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
  { runSync: true, serverOnly: true }
)(App);
