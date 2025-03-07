import { PageContextClient } from 'vike/types';
import { route as parentRoute } from '../+route';

export const route = (pageContext: PageContextClient) =>
  parentRoute(pageContext, true);
