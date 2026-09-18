import { PageContextServer } from 'vike/types';
import { fetchEvent } from '~/redux/actions/EventActions';

const data = async (pageContext: PageContextServer) => {
  const { store, routeParams } = pageContext;
  const { eventIdOrSlug } = routeParams;
  const { dispatch } = store;

  if (!eventIdOrSlug) return;

  await dispatch(fetchEvent(eventIdOrSlug));
};

export { data };
export type Data = Awaited<ReturnType<typeof data>>;
