// https://vike.dev/Head

import { usePageContext } from 'vike-react/usePageContext';
import { appConfig } from '~/utils/appConfig';

export default function HeadDefault() {
  const pageContext = usePageContext();
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#f2f2f1" />
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="/opensearch.xml"
        title="Abakus Søk"
      />
      <link rel="icon" href="/icon-512x512.png" sizes="512x512" />
      <link rel="apple-touch-icon" href="/icon-512x512.png" sizes="512x512" />
      <link rel="icon" href="/icon-384x384.png" sizes="384x384" />
      <link rel="apple-touch-icon" href="/icon-384x384.png" sizes="384x384" />
      <link rel="icon" href="/icon-256x256.png" sizes="256x256" />
      <link rel="apple-touch-icon" href="/icon-256x256.png" sizes="256x256" />
      <link rel="icon" href="/icon-192x192.png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" sizes="192x192" />
      <link rel="icon" href="/icon-96x96.png" sizes="96x96" />
      <link rel="apple-touch-icon" href="/icon-96x96.png" sizes="96x96" />
      <link rel="icon" href="/icon-48x48.png" sizes="48x48" />
      <link rel="apple-touch-icon" href="/icon-48x48.png" sizes="48x48" />
      <link rel="manifest" href="/manifest.json" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Abakus" />

      {!import.meta.env.DEV && (
        <script
          defer
          // The .replace() removes the protocol (https://) part of the url, leaving just the domain
          data-domain={appConfig.webUrl.replace(/(^\w+:|^)\/\//, '')}
          src="https://ls.webkom.dev/js/script.js"
        ></script>
      )}

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Open+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      {import.meta.env.SSR && [
        pageContext.helmetContext?.helmet?.title.toComponent(),
        pageContext.helmetContext?.helmet?.meta.toComponent(),
        pageContext.helmetContext?.helmet?.link.toComponent(),
      ]}

      <script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
      ></script>
      <script
        noModule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
      ></script>
      {pageContext.preparedStateCode && (
        <script
          dangerouslySetInnerHTML={{ __html: pageContext.preparedStateCode }}
        />
      )}
    </>
  );
}
