import { EntityType } from 'app/store/models/entities';

const entityTypeMappings = {
  'events.event': EntityType.Events,
  'articles.article': EntityType.Articles,
  'quotes.quote': EntityType.Quotes,
  'companies.company': EntityType.Companies,
  'meetings.meeting': EntityType.Meetings,
  'gallery.gallerypicture': EntityType.GalleryPictures,
  'forums.thread': EntityType.Thread,
  'comments.comment': EntityType.Comments,
};
export type EntityServerName = keyof typeof entityTypeMappings;
export default function getEntityType(
  serverName: EntityServerName,
): EntityType {
  return entityTypeMappings[serverName];
}
