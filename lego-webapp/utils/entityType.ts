import { EntityType } from '~/redux/models/entities';

const entityTypeMappings = {
  'events.event': EntityType.Events,
  'articles.article': EntityType.Articles,
  'quotes.quote': EntityType.Quotes,
  'companies.company': EntityType.Companies,
  'meetings.meeting': EntityType.Meetings,
  'gallery.gallerypicture': EntityType.GalleryPictures,
  'comments.comment': EntityType.Comments,
  'lending.lendingrequest': EntityType.LendingRequests,
};
export type EntityServerName = keyof typeof entityTypeMappings;
export function getEntityType(serverName: EntityServerName): EntityType {
  return entityTypeMappings[serverName];
}
