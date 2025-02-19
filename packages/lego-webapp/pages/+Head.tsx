// https://vike.dev/Head

import { usePageContext } from 'vike-react/usePageContext';
import logoUrl from '~/assets/logo.svg';

export default function HeadDefault() {
  const pageContext = usePageContext();
  return (
    <>
      <link rel="icon" href={logoUrl} />

      {import.meta.env.SSR && [
        pageContext.helmetContext?.helmet?.title.toComponent(),
        pageContext.helmetContext?.helmet?.meta.toComponent(),
        pageContext.helmetContext?.helmet?.link.toComponent(),
      ]}

      {/* See https://plausible.io/docs/plausible-script */}
      {/* TODO: update data-domain */}
      <script
        defer
        data-domain="yourdomain.com"
        src="https://plausible.io/js/script.js"
      ></script>
    </>
  );
}
