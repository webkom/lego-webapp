import { PageContextClient } from 'vike/types';

// Stupid manual routing because Vike ignores "pages" folder
export const route = (pageContext: PageContextClient, editRoute = false) => {
  const [, base, section, pageSlug, edit, ...rest] =
    pageContext.urlPathname.split('/');
  if (
    base !== 'pages' ||
    !section ||
    rest.length > 0 ||
    edit !== (editRoute ? 'edit' : undefined)
  ) {
    return false;
  } else {
    return {
      routeParams: {
        section,
        ...(pageSlug ? { pageSlug } : {}),
      },
    };
  }
};
