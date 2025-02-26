import { contextRender } from '~/components/Feed/context';
import joinValues from '~/utils/joinValues';
import type { ReactNode } from 'react';
import type { TagComponent } from '~/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from '~/redux/models/FeedActivity';

type ActorsProps = {
  aggregatedActivity: AggregatedFeedActivity;
  Tag: TagComponent;
};
export const UserActors = ({ aggregatedActivity, Tag }: ActorsProps) => {
  const actors = aggregatedActivity.actorIds.map((actorId) => {
    return aggregatedActivity.context[`users.user-${actorId}`];
  });
  const actorComponents = actors.map((actor) => (
    <Tag key={actor.id} {...contextRender[actor.contentType](actor)} />
  ));
  return <>{formatHeader(actorComponents)}</>;
};

export function formatHeader(values: ReactNode[]): ReactNode {
  if (values.length === 3) {
    values = values.slice(0, 2);
    values.push('en annen');
    return joinValues(values);
  } else if (values.length > 3) {
    const rest = values.length - 2;
    values = values.slice(0, 2);
    values.push(`${rest} andre`);
    return joinValues(values);
  }

  return joinValues(values);
}
