import { PageContextServer } from 'vike/types';
import { useConfig } from 'vike-react/useConfig';
import { PageContextProvider } from 'vike-react/usePageContext';
import { selectCurrentUser } from '~/redux/slices/auth';
import { setTheme } from '~/redux/slices/theme';
import { prepareWithTimeout } from '~/utils/prepareWithTimeout';
import { resolveTheme } from '~/utils/themeUtils';
import Wrapper from './+Wrapper';

export async function onBeforeRenderHtml(pageContext: PageContextServer) {
  const config = useConfig();
  const state = pageContext.store.getState();
  const theme = resolveTheme(
    selectCurrentUser(state)?.selectedTheme,
    null,
    false,
  );
  pageContext.store.dispatch(setTheme(theme));
  config({ htmlAttributes: { 'data-theme': theme } });

  // Helmet support
  pageContext.helmetContext = {};
  // Fucking react-prepare
  const Page = pageContext.Page;
  if (Page)
    try {
      pageContext.preparedStateCode = await prepareWithTimeout(
        <PageContextProvider pageContext={pageContext}>
          <Wrapper>
            <Page />
          </Wrapper>
        </PageContextProvider>,
      );
    } catch (error) {
      console.error(error);
    }
}
