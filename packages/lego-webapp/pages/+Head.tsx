// https://vike.dev/Head

import { usePageContext } from 'vike-react/usePageContext';
import { appConfig } from '~/utils/appConfig';

export default function HeadDefault() {
  const pageContext = usePageContext();
  return (
    <>
      {import.meta.env.SSR && [
        pageContext.helmetContext?.helmet?.title.toComponent(),
        pageContext.helmetContext?.helmet?.meta.toComponent(),
        pageContext.helmetContext?.helmet?.link.toComponent(),
      ]}

      {!import.meta.env.DEV && (
        <script
          defer
          // The .replace() removes the protocol (https://) part of the url, leaving just the domain
          data-domain={appConfig.webUrl.replace(/(^\w+:|^)\/\//, '')}
          src="https://ls.webkom.dev/js/script.js"
        ></script>
      )}
      <script
        dangerouslySetInnerHTML={{ __html: pageContext.preparedStateCode }}
      />
    </>
  );
}
