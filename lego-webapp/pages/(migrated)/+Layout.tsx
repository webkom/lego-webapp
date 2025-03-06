import { Provider as LegoBricksProvider } from '@webkom/lego-bricks';
import {
  ComponentProps,
  type PropsWithChildren,
  ReactNode,
  useEffect,
} from 'react';
import 'minireset.css/minireset.css';
import '~/styles/globals.css';
import '@webkom/lego-bricks/dist/style.css';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import { usePageContext } from 'vike-react/usePageContext';
import HTTPError from 'app/routes/errors';
import coverPhoto from '~/assets/cover.png';
import ErrorBoundary from '~/components/ErrorBoundary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import PhotoUploadStatus from '~/components/PhotoUploadStatus';
import ToastProvider from '~/components/Toast/ToastProvider';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { setStatusCode } from '~/redux/slices/routing';
import appConfig from '~/utils/appConfig';
import { useTheme } from '~/utils/themeUtils';
import styles from './Layout.module.css';

const AppChildren = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const statusCode = useAppSelector((state) => state.router.statusCode);
  const pageContext = usePageContext();

  // Clear status code when navigating
  useEffect(() => {
    if (statusCode != null) {
      dispatch(setStatusCode(null));
    }
    // We don't want to run this effect when the status code changes (that would instantly clear it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pageContext.urlPathname]);

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <ErrorBoundary resetOnChange={pageContext.urlPathname}>
        <ToastProvider />
        {statusCode ? <HTTPError statusCode={statusCode} /> : <>{children}</>}
      </ErrorBoundary>
    </div>
  );
};

const useLocation: ComponentProps<typeof LegoBricksProvider>['useLocation'] = <
  S = unknown,
>() => {
  const pageContext = usePageContext();
  return {
    pathname: pageContext.urlParsed.pathname,
    search: pageContext.urlParsed.searchOriginal ?? '',
    navigationState: undefined as S | undefined,
  };
};

export default function Layout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <LegoBricksProvider
      theme={theme}
      navigate={(href, { navigationState, ...options } = {}) =>
        navigate(href, { ...options, pageContext: { navigationState } })
      }
      useLocation={useLocation}
    >
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

        <AppChildren>{children}</AppChildren>

        <PhotoUploadStatus />

        <Footer />
      </div>
    </LegoBricksProvider>
  );
}
